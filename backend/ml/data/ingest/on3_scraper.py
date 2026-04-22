"""On3 NIL valuation ingest with a manual CSV fallback.

This module is a label-source adapter. It prefers to read NIL valuations from
a manually curated CSV at ``data/cache/on3_manual.csv`` because:

1. On3 content is copyrighted and automated scraping may be disallowed by the
   site's Terms of Service or robots.txt.
2. A manual CSV makes the label source explicit and auditable for an academic
   project.

The CSV must have the columns ``player_name,school,position,nil_value_usd``.
All four are required. Rows with a blank ``nil_value_usd`` are skipped.

An automated scraper is stubbed at ``scrape_on3_rankings`` for completeness,
but it refuses to run unless the caller explicitly passes
``allow_automated=True`` AND sets the environment variable
``ON3_SCRAPE_CONFIRMED=1``. Only enable after a manual ToS and robots.txt
review.
"""

from __future__ import annotations

import argparse
import csv
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator, Optional

from data.schema import Position


@dataclass(frozen=True)
class NILLabel:
    """A single NIL valuation label.

    Attributes
    ----------
    player_name : str
        Name to join on, case-insensitive.
    school : str
        School to disambiguate same-name players across schools.
    position : Position
    nil_value_usd : float
    """

    player_name: str
    school: str
    position: Position
    nil_value_usd: float


def load_manual_csv(path: str | Path) -> list[NILLabel]:
    """Read manually entered On3 valuations from a CSV file.

    Parameters
    ----------
    path : str or Path
        Path to a CSV with header
        ``player_name,school,position,nil_value_usd``.

    Returns
    -------
    list of NILLabel

    Raises
    ------
    FileNotFoundError
        If the CSV does not exist. The caller is expected to create the file
        before building the dataset.
    ValueError
        If required columns are missing or values fail to parse.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(
            f"Manual NIL label CSV not found at {path}. Create it with columns: "
            "player_name,school,position,nil_value_usd"
        )

    required = {"player_name", "school", "position", "nil_value_usd"}
    labels: list[NILLabel] = []
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            missing = required - set(reader.fieldnames or [])
            raise ValueError(f"Manual NIL CSV missing columns: {sorted(missing)}")
        for row in reader:
            raw_val = (row.get("nil_value_usd") or "").strip()
            if not raw_val:
                continue
            try:
                value = float(raw_val.replace(",", "").replace("$", ""))
            except ValueError as exc:
                raise ValueError(
                    f"Could not parse nil_value_usd={raw_val!r} for "
                    f"{row.get('player_name')!r}"
                ) from exc
            pos = (row.get("position") or "").strip().upper()
            if pos not in {"QB", "WR", "TE", "MLB", "S"}:
                # Skip positions we do not model.
                continue
            labels.append(
                NILLabel(
                    player_name=(row["player_name"] or "").strip(),
                    school=(row["school"] or "").strip(),
                    position=pos,  # type: ignore[arg-type]
                    nil_value_usd=value,
                )
            )
    return labels


def index_by_name_school(labels: list[NILLabel]) -> dict[tuple[str, str], NILLabel]:
    """Index labels by a normalized (name, school) tuple.

    Parameters
    ----------
    labels : list of NILLabel

    Returns
    -------
    dict
        Maps ``(name_lower, school_lower)`` to the NILLabel. When duplicates
        exist, the highest valuation wins (conservative for ceiling analysis).
    """
    out: dict[tuple[str, str], NILLabel] = {}
    for label in labels:
        key = (label.player_name.lower().strip(), label.school.lower().strip())
        existing = out.get(key)
        if existing is None or label.nil_value_usd > existing.nil_value_usd:
            out[key] = label
    return out


# --- Stubbed automated path ----------------------------------------------


def _confirm_automated_allowed() -> None:
    """Raise unless the caller has explicitly consented to automated scraping.

    The academic setup for this project disallows scraping until a manual
    robots.txt and ToS review has been documented. See DATA_SOURCES.md.
    """
    if os.environ.get("ON3_SCRAPE_CONFIRMED") != "1":
        raise PermissionError(
            "Automated On3 scraping is disabled. Set ON3_SCRAPE_CONFIRMED=1 "
            "only after you have reviewed On3's Terms of Service and "
            "robots.txt. Preferred path: maintain data/cache/on3_manual.csv."
        )


def scrape_on3_rankings(
    urls: list[str],
    *,
    allow_automated: bool = False,
    session: Optional[object] = None,
    sleep_seconds: float = 3.0,
) -> Iterator[NILLabel]:
    """Placeholder scraper. Does not emit any labels unless explicitly enabled.

    Parameters
    ----------
    urls : list of str
        Ranking page URLs to crawl.
    allow_automated : bool, default False
        Must be True AND the environment confirmation must be set.
    session : object, optional
        A ``requests.Session``-like object. When None, a real session is built
        on demand.
    sleep_seconds : float, default 3.0
        Minimum delay between requests. Conservative default for a polite
        crawl.

    Yields
    ------
    NILLabel
    """
    if not allow_automated:
        raise PermissionError(
            "scrape_on3_rankings called without allow_automated=True. Use the "
            "manual CSV at data/cache/on3_manual.csv instead."
        )
    _confirm_automated_allowed()

    import requests  # deferred import so tests need not install requests

    sess = session if session is not None else requests.Session()
    sess.headers.update(
        {
            "User-Agent": os.environ.get(
                "SCRAPER_USER_AGENT", "sec-nil-research/0.1 (academic project)"
            )
        }
    )
    for url in urls:
        resp = sess.get(url, timeout=30)  # type: ignore[call-arg]
        resp.raise_for_status()
        yield from _parse_on3_html(resp.text)
        time.sleep(sleep_seconds)


def _parse_on3_html(html: str) -> Iterator[NILLabel]:
    """Parse an On3 rankings HTML page into NILLabel rows.

    This is intentionally minimal. If activated, it must be hardened against
    markup drift and rate-limited politely. It is only defined so the
    interface is complete.
    """
    from bs4 import BeautifulSoup  # type: ignore[import-not-found]

    soup = BeautifulSoup(html, "html.parser")
    for row in soup.select("div.player-row"):
        name = row.select_one(".player-name")
        school = row.select_one(".player-school")
        position = row.select_one(".player-position")
        value = row.select_one(".player-value")
        if not all([name, school, position, value]):
            continue
        try:
            dollars = float(
                value.get_text().replace("$", "").replace(",", "").replace("M", "e6").replace("K", "e3")
            )
        except ValueError:
            continue
        pos_text = position.get_text().strip().upper()
        if pos_text not in {"QB", "WR", "TE", "MLB", "S"}:
            continue
        yield NILLabel(
            player_name=name.get_text().strip(),
            school=school.get_text().strip(),
            position=pos_text,  # type: ignore[arg-type]
            nil_value_usd=dollars,
        )


# --- CLI ------------------------------------------------------------------


def _main() -> None:
    parser = argparse.ArgumentParser(description="Validate the manual On3 CSV.")
    parser.add_argument("--conference", default="SEC")
    parser.add_argument("--csv", default="data/cache/on3_manual.csv")
    args = parser.parse_args()
    labels = load_manual_csv(args.csv)
    print(f"Loaded {len(labels)} NIL labels from {args.csv}")
    for label in labels[:5]:
        print(f"  {label.player_name} ({label.school}, {label.position}): ${label.nil_value_usd:,.0f}")


if __name__ == "__main__":
    _main()
