"""Social media follower counts.

To avoid scraping Instagram or X (neither of which permits unauthenticated
automated access reliably), this module reads a manually curated CSV at
``data/cache/social_followers.csv`` and exposes a lookup keyed by
``(player_name, school)``.

Expected CSV columns
--------------------
- ``player_name`` : display name.
- ``school`` : school name.
- ``instagram_followers`` : integer or blank.
- ``x_followers`` : integer or blank.

Missing cells are treated as None (unknown), not zero. Downstream
preprocessing imputes unknowns with the training median.
"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Optional


def load_follower_counts(
    path: str | Path,
) -> dict[tuple[str, str], Optional[float]]:
    """Load the social follower count lookup.

    Parameters
    ----------
    path : str or Path

    Returns
    -------
    dict
        Maps ``(name_lower, school_lower)`` to total follower count, or None
        when both columns are blank for that player.
    """
    path = Path(path)
    out: dict[tuple[str, str], Optional[float]] = {}
    if not path.exists():
        # Absence is allowed; callers treat all follower counts as unknown.
        return out

    required = {"player_name", "school", "instagram_followers", "x_followers"}
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames or not required.issubset(reader.fieldnames):
            missing = required - set(reader.fieldnames or [])
            raise ValueError(f"Social followers CSV missing columns: {sorted(missing)}")
        for row in reader:
            key = (
                (row.get("player_name") or "").lower().strip(),
                (row.get("school") or "").lower().strip(),
            )
            ig = _safe_int(row.get("instagram_followers"))
            xf = _safe_int(row.get("x_followers"))
            if ig is None and xf is None:
                out[key] = None
                continue
            total = float((ig or 0) + (xf or 0))
            out[key] = total
    return out


def _safe_int(value: Optional[str]) -> Optional[int]:
    """Coerce a string to int, stripping commas. Return None on blank."""
    if value is None:
        return None
    cleaned = value.strip().replace(",", "")
    if not cleaned:
        return None
    try:
        return int(cleaned)
    except ValueError:
        return None
