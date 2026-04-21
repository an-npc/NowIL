"""Loader for Knight-Newhouse school athletic revenue data.

A one-time CSV downloaded from https://knightnewhousedata.org/ and placed at
``data/cache/knight_newhouse_sec.csv``. The loader exposes a dict keyed by
school name, with total athletic revenue in USD for the configured fiscal
year.

Expected CSV columns
--------------------
- ``school`` : school display name matching the SEC team list.
- ``fiscal_year`` : integer (e.g. 2024).
- ``total_revenue_usd`` : float, total athletic department revenue.

Rows for schools not in the SEC team list are ignored.
"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Iterable, Optional


def load_school_revenue(
    path: str | Path,
    fiscal_year: int,
    sec_teams: Iterable[str],
) -> dict[str, float]:
    """Load total athletic revenue by school for a given fiscal year.

    Parameters
    ----------
    path : str or Path
        Path to the Knight-Newhouse CSV.
    fiscal_year : int
        Fiscal year to filter on.
    sec_teams : iterable of str
        Canonical SEC school names.

    Returns
    -------
    dict
        Maps school name to total revenue in USD. Missing schools are not
        included; callers should treat them as None.

    Raises
    ------
    FileNotFoundError
        If the CSV does not exist.
    ValueError
        If required columns are missing.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(
            f"Knight-Newhouse CSV not found at {path}. Download it from "
            "https://knightnewhousedata.org/ and save it there."
        )

    sec_set = {s.lower() for s in sec_teams}
    required = {"school", "fiscal_year", "total_revenue_usd"}
    out: dict[str, float] = {}
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            missing = required - set(reader.fieldnames or [])
            raise ValueError(f"Knight-Newhouse CSV missing columns: {sorted(missing)}")
        for row in reader:
            year = _safe_int(row.get("fiscal_year"))
            if year != fiscal_year:
                continue
            school = (row.get("school") or "").strip()
            if school.lower() not in sec_set:
                continue
            value = _safe_float(row.get("total_revenue_usd"))
            if value is None:
                continue
            out[school] = value
    return out


def _safe_int(value: Optional[str]) -> Optional[int]:
    """Coerce a string to int; return None on failure."""
    if value is None or value.strip() == "":
        return None
    try:
        return int(value)
    except ValueError:
        return None


def _safe_float(value: Optional[str]) -> Optional[float]:
    """Coerce a string (possibly with $ or commas) to float."""
    if value is None:
        return None
    cleaned = value.strip().replace("$", "").replace(",", "")
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None
