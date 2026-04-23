"""Load and validate player data from the shared players.json file.

Reads ``/Users/alexisharvey/Downloads/players.json`` at runtime. The file is
keyed by ESPN ID, and each entry follows the ``PlayerTableData`` schema:

    player_id, first_name, last_name, school, sport, position,
    college_year, nil (integer), nil_delta (number)

Players whose position is not in the tracked set or whose ``nil`` is zero
are logged and skipped.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

PLAYERS_JSON_PATH = "/Users/alexisharvey/Downloads/players.json"

TRACKED_POSITIONS = {"QB", "WR", "TE", "LB", "S"}


@dataclass
class TrackedPlayer:
    """A player loaded from players.json with a valid starting NIL.

    Attributes
    ----------
    espn_id : str
    player_id : int
    first_name : str
    last_name : str
    name : str
        ``first_name + " " + last_name``.
    school : str
    position : str
    college_year : str
    initial_nil : int
    """

    espn_id: str
    player_id: int
    first_name: str
    last_name: str
    name: str
    school: str
    position: str
    college_year: str
    initial_nil: int


def load_players(
    path: Optional[str | Path] = None,
    tracked_positions: Optional[set[str]] = None,
    require_nil: bool = True,
    require_school: bool = True,
) -> list[TrackedPlayer]:
    """Read and validate players from the JSON file.

    Parameters
    ----------
    path : str or Path, optional
        Override the default path for testing.
    tracked_positions : set of str, optional
        Positions to include. Defaults to QB, WR, TE, LB, S.
    require_nil : bool, default True
        If True, skip players whose ``nil`` field is 0 or missing.
    require_school : bool, default True
        If True, skip players with an empty ``school`` field.

    Returns
    -------
    list of TrackedPlayer
    """
    path = Path(path or PLAYERS_JSON_PATH)
    positions = tracked_positions or TRACKED_POSITIONS

    if not path.exists():
        raise FileNotFoundError(f"Players JSON not found at {path}")

    with path.open("r", encoding="utf-8") as fh:
        raw = json.load(fh)

    if not isinstance(raw, dict):
        raise ValueError(
            f"Expected a JSON object keyed by ESPN ID, got {type(raw).__name__}"
        )

    players: list[TrackedPlayer] = []
    skipped_position = 0
    skipped_nil = 0
    skipped_school = 0

    for espn_id, entry in raw.items():
        pos = (entry.get("position") or "").strip().upper()
        if pos not in positions:
            skipped_position += 1
            continue

        nil_val = entry.get("nil")
        if nil_val is None or (require_nil and int(nil_val) <= 0):
            skipped_nil += 1
            continue

        school = (entry.get("school") or "").strip()
        if require_school and not school:
            skipped_school += 1
            continue

        first = (entry.get("first_name") or "").strip()
        last = (entry.get("last_name") or "").strip()

        players.append(
            TrackedPlayer(
                espn_id=str(espn_id),
                player_id=int(entry.get("player_id", 0)),
                first_name=first,
                last_name=last,
                name=f"{first} {last}".strip(),
                school=school,
                position=pos,
                college_year=(entry.get("college_year") or ""),
                initial_nil=int(nil_val),
            )
        )

    logger.info(
        "Loaded %d players (skipped: %d wrong position, %d no NIL, %d no school)",
        len(players),
        skipped_position,
        skipped_nil,
        skipped_school,
    )
    return players
