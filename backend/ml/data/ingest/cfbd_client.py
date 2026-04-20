"""CFBD API ingest for SEC player rosters and statistics.

Uses direct HTTP requests to the CFBD REST API rather than the cfbd Python
package, because the package pins pydantic <2 and we need pydantic v2 for our
schema.

Entry points
------------
- ``fetch_roster`` : SEC roster for a season filtered by position.
- ``fetch_season_stats`` : season-level player stats.
- ``fetch_team_records`` : W/L records and SoS for team-level context.

CLI usage
---------
    python -m data.ingest.cfbd_client --conference SEC --season 2025 \\
        --positions QB,WR,TE,MLB,S --output data/cache/cfbd_rosters_stats.json
"""

from __future__ import annotations

import argparse
import json
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Optional

import requests

from data.schema import Player, SeasonStats

CFBD_BASE = "https://api.collegefootballdata.com"

CFBD_POSITION_MAP: dict[str, set[str]] = {
    "QB": {"QB"},
    "WR": {"WR"},
    "TE": {"TE"},
    "MLB": {"LB", "ILB", "MLB"},
    "S": {"S", "FS", "SS", "DB"},
}

CATEGORY_STAT_TO_FIELD: dict[tuple[str, str], str] = {
    ("passing", "ATT"): "pass_attempts",
    ("passing", "COMPLETIONS"): "pass_completions",
    ("passing", "YDS"): "pass_yards",
    ("passing", "TD"): "pass_tds",
    ("passing", "INT"): "pass_ints_thrown",
    ("passing", "PCT"): "pass_completion_pct",
    ("passing", "QBR"): "qbr",
    ("rushing", "CAR"): "rush_attempts",
    ("rushing", "YDS"): "rush_yards",
    ("rushing", "TD"): "rush_tds",
    ("receiving", "REC"): "receptions",
    ("receiving", "TAR"): "targets",
    ("receiving", "YDS"): "receiving_yards",
    ("receiving", "TD"): "receiving_tds",
    ("receiving", "YPR"): "yards_per_reception",
    ("receiving", "LONG"): "longest_reception",
    ("defensive", "TOT"): "total_tackles",
    ("defensive", "SOLO"): "solo_tackles",
    ("defensive", "TFL"): "tfl",
    ("defensive", "SACKS"): "sacks",
    ("defensive", "QB HUR"): "qb_hurries",
    ("defensive", "INT"): "def_ints",
    ("defensive", "PD"): "pass_breakups",
    ("fumbles", "FF"): "forced_fumbles",
    ("fumbles", "REC"): "fumble_recoveries",
}


@dataclass(frozen=True)
class CFBDConfig:
    """Holds the CFBD API key and configured season."""

    api_key: str
    season: int
    conference: str = "SEC"


def _load_api_key() -> str:
    """Load the CFBD API key from the environment."""
    key = os.environ.get("CFBD_API_KEY", "").strip()
    if not key:
        raise RuntimeError(
            "CFBD_API_KEY is not set. Copy .env.example to .env and add a key "
            "from https://collegefootballdata.com/key."
        )
    return key


def _cfbd_get(config: CFBDConfig, endpoint: str, params: dict[str, Any]) -> Any:
    """Make an authenticated GET request to the CFBD API.

    Parameters
    ----------
    config : CFBDConfig
    endpoint : str
        API path without the base URL (e.g. ``"/roster"``).
    params : dict
        Query parameters.

    Returns
    -------
    Parsed JSON (list or dict).
    """
    url = f"{CFBD_BASE}{endpoint}"
    headers = {
        "Authorization": f"Bearer {config.api_key}",
        "Accept": "application/json",
    }
    resp = requests.get(url, params=params, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def _normalize_position(cfbd_position: Optional[str], target_positions: Iterable[str]) -> Optional[str]:
    """Map a CFBD position string to one of our canonical positions."""
    if cfbd_position is None:
        return None
    upper = cfbd_position.upper()
    for canonical in target_positions:
        if upper in CFBD_POSITION_MAP.get(canonical, set()):
            return canonical
    return None


def _normalize_class_year(raw: Any) -> Optional[str]:
    """Map CFBD year values to our ClassYear labels."""
    if raw is None:
        return None
    if isinstance(raw, int):
        table = {1: "FR", 2: "SO", 3: "JR", 4: "SR", 5: "GR"}
        return table.get(raw)
    if isinstance(raw, str):
        upper = raw.strip().upper()
        if upper in {"FR", "SO", "JR", "SR", "GR"}:
            return upper
        table = {
            "FRESHMAN": "FR",
            "SOPHOMORE": "SO",
            "JUNIOR": "JR",
            "SENIOR": "SR",
            "GRADUATE": "GR",
        }
        return table.get(upper)
    return None


def _safe_int(value: Any) -> Optional[int]:
    """Best-effort int coercion. Returns None on failure."""
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def fetch_roster(
    config: CFBDConfig,
    positions: Iterable[str],
    sec_teams: Iterable[str],
    _api_func: Any = None,
) -> list[Player]:
    """Fetch SEC roster players for the requested positions.

    Parameters
    ----------
    config : CFBDConfig
    positions : iterable of str
    sec_teams : iterable of str
    _api_func : callable, optional
        Override for testing. Signature: ``(team, year) -> list[dict]``.

    Returns
    -------
    list of Player
    """
    positions = list(positions)
    teams = list(sec_teams)
    api = _api_func or (lambda team, year: _cfbd_get(config, "/roster", {"team": team, "year": year}))

    players: list[Player] = []
    for team in teams:
        rows = api(team, config.season)
        for row in rows:
            pos = _normalize_position(row.get("position"), positions)
            if pos is None:
                continue
            first = row.get("firstName") or row.get("first_name") or ""
            last = row.get("lastName") or row.get("last_name") or ""
            name = f"{first} {last}".strip()
            player = Player(
                player_id=str(row.get("id", "")),
                name=name,
                school=team,
                position=pos,  # type: ignore[arg-type]
                class_year=_normalize_class_year(row.get("year")),
                jersey=_safe_int(row.get("jersey")),
            )
            players.append(player)
        time.sleep(0.3)
    return players


def fetch_season_stats(
    config: CFBDConfig,
    players: list[Player],
    _api_func: Any = None,
) -> list[SeasonStats]:
    """Fetch season-aggregated stats for the given players.

    Parameters
    ----------
    config : CFBDConfig
    players : list of Player
    _api_func : callable, optional
        Override for testing. Signature: ``(year, conference) -> list[dict]``.

    Returns
    -------
    list of SeasonStats
    """
    api = _api_func or (
        lambda year, conference: _cfbd_get(
            config, "/stats/player/season",
            {"year": year, "conference": conference},
        )
    )
    player_id_set = {p.player_id for p in players}
    rows = api(config.season, config.conference)

    by_player: dict[str, dict[str, float]] = {}

    for row in rows:
        pid = str(row.get("playerId") or row.get("player_id") or "")
        if pid not in player_id_set:
            continue
        category = (row.get("category") or "").lower()
        stat_type = (row.get("statType") or row.get("stat_type") or "").upper()
        field = CATEGORY_STAT_TO_FIELD.get((category, stat_type))
        if field is None:
            continue
        try:
            value = float(row.get("stat", 0))
        except (TypeError, ValueError):
            continue
        by_player.setdefault(pid, {})[field] = value

    out: list[SeasonStats] = []
    for pid, fields in by_player.items():
        out.append(
            SeasonStats(
                player_id=pid,
                season=config.season,
                games_played=0,
                **fields,
            )
        )
    return out


def fetch_team_records(
    config: CFBDConfig,
    sec_teams: list[str],
    _api_func: Any = None,
) -> dict[str, dict[str, float]]:
    """Fetch team W/L records for the season.

    Parameters
    ----------
    config : CFBDConfig
    sec_teams : list of str
    _api_func : callable, optional

    Returns
    -------
    dict mapping school to {"team_win_pct": float, "sos": float}.
    """
    api = _api_func or (
        lambda year, conference: _cfbd_get(
            config, "/records",
            {"year": year, "conference": conference},
        )
    )
    rows = api(config.season, config.conference)
    out: dict[str, dict[str, float]] = {}
    for row in rows:
        school = row.get("team", "")
        total = row.get("total", {})
        wins = total.get("wins", 0)
        losses = total.get("losses", 0)
        total_games = wins + losses
        pct = wins / total_games if total_games > 0 else 0.0
        out[school] = {"team_win_pct": pct, "sos": 0.0}
    return out


# --- CLI ------------------------------------------------------------------


def _main() -> None:
    parser = argparse.ArgumentParser(description="Pull SEC CFBD data to JSON cache.")
    parser.add_argument("--conference", default="SEC")
    parser.add_argument("--season", type=int, required=True)
    parser.add_argument("--positions", default="QB,WR,TE,MLB,S")
    parser.add_argument("--output", default="data/cache/cfbd_rosters_stats.json")
    args = parser.parse_args()

    from dotenv import load_dotenv

    load_dotenv()

    import yaml

    with open("config/sec_football_config.yaml", "r", encoding="utf-8") as fh:
        cfg = yaml.safe_load(fh)

    positions = [p.strip() for p in args.positions.split(",") if p.strip()]
    cfg_cfbd = CFBDConfig(
        api_key=_load_api_key(),
        season=args.season,
        conference=args.conference,
    )

    print("Fetching rosters...")
    roster = fetch_roster(cfg_cfbd, positions, cfg["sec_teams"])
    print(f"  {len(roster)} players")

    print("Fetching season stats...")
    season_stats = fetch_season_stats(cfg_cfbd, roster)
    print(f"  {len(season_stats)} stat rows")

    print("Fetching team records...")
    team_records = fetch_team_records(cfg_cfbd, cfg["sec_teams"])
    print(f"  {len(team_records)} teams")

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "roster": [p.model_dump() for p in roster],
        "season_stats": [s.model_dump() for s in season_stats],
        "team_records": team_records,
    }
    with out_path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)
    print(f"Wrote to {out_path}")


if __name__ == "__main__":
    _main()
