"""Fetch per-game player stats from the CFBD API with local caching.

Uses the ``/games/players`` endpoint which returns deeply nested JSON:
game -> teams -> categories -> types -> athletes.

We flatten this into per-player-per-game dicts keyed by stat name, then
cache each team-week response as a JSON file so reruns skip the network.
"""

from __future__ import annotations

import json
import logging
import os
import time
from pathlib import Path
from typing import Any, Optional

import requests

from tracker.ingest.load_players import TrackedPlayer

logger = logging.getLogger(__name__)

CFBD_BASE = "https://api.collegefootballdata.com"

# Maps (category, type_name) from the API to our flat stat names.
STAT_MAP: dict[tuple[str, str], str] = {
    ("passing", "C/ATT"): "_c_att",       # special: split into completions + attempts
    ("passing", "YDS"): "pass_yards",
    ("passing", "TD"): "pass_tds",
    ("passing", "INT"): "ints",
    ("passing", "QBR"): "qbr",
    ("rushing", "CAR"): "rush_attempts",
    ("rushing", "YDS"): "rush_yards",
    ("rushing", "TD"): "rush_tds",
    ("receiving", "REC"): "receptions",
    ("receiving", "YDS"): "receiving_yards",
    ("receiving", "TD"): "receiving_tds",
    ("receiving", "AVG"): "yards_per_rec",
    ("defensive", "TOT"): "total_tackles",
    ("defensive", "SOLO"): "solo_tackles",
    ("defensive", "TFL"): "tfl",
    ("defensive", "SACKS"): "sacks",
    ("defensive", "PD"): "pass_breakups",
    ("defensive", "QB HUR"): "qb_hurries",
    ("defensive", "TD"): "defensive_tds",
    ("interceptions", "INT"): "def_ints",
    ("interceptions", "TD"): "_int_td",
    ("fumbles", "FF"): "forced_fumbles",
    ("fumbles", "REC"): "fumble_recoveries",
}


def _load_api_key() -> str:
    key = os.environ.get("CFBD_API_KEY", "").strip()
    if not key:
        raise RuntimeError("CFBD_API_KEY not set. Check ~/Desktop/GITHUB/ml/.env")
    return key


def _cache_path(cache_dir: str, team: str, year: int, week: int, season_type: str) -> Path:
    safe_team = team.replace(" ", "_").replace("/", "_")
    return Path(cache_dir) / f"game_stats_{safe_team}_{year}_w{week}_{season_type}.json"


def _cfbd_get(api_key: str, endpoint: str, params: dict[str, Any]) -> Any:
    headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/json"}
    resp = requests.get(f"{CFBD_BASE}{endpoint}", params=params, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def fetch_team_week_stats(
    team: str,
    year: int,
    week: int,
    season_type: str,
    api_key: str,
    cache_dir: str,
    rate_limit: float = 0.3,
) -> list[dict[str, Any]]:
    """Fetch game player stats for one team in one week.

    Returns a list of per-player dicts with flattened stat names. Caches
    the raw API response so subsequent calls skip the network.

    Parameters
    ----------
    team : str
    year : int
    week : int
    season_type : str
    api_key : str
    cache_dir : str
    rate_limit : float

    Returns
    -------
    list of dict
        Each dict has keys: athlete_id, athlete_name, team, opponent,
        home_away, team_points, opp_points, plus stat fields.
    """
    cp = _cache_path(cache_dir, team, year, week, season_type)
    cp.parent.mkdir(parents=True, exist_ok=True)

    if cp.exists():
        with cp.open("r", encoding="utf-8") as fh:
            raw_games = json.load(fh)
    else:
        raw_games = _cfbd_get(
            api_key,
            "/games/players",
            {"year": year, "week": week, "team": team, "seasonType": season_type},
        )
        with cp.open("w", encoding="utf-8") as fh:
            json.dump(raw_games, fh)
        time.sleep(rate_limit)

    return _flatten_game_stats(raw_games, team)


def _flatten_game_stats(raw_games: list[dict], target_team: str) -> list[dict[str, Any]]:
    """Flatten the nested CFBD game/players response into per-player rows."""
    rows: list[dict[str, Any]] = []
    for game in raw_games:
        teams = game.get("teams", [])
        our_team = None
        opp_team = None
        for t in teams:
            if t.get("team", "").lower() == target_team.lower():
                our_team = t
            else:
                opp_team = t
        if our_team is None:
            continue

        opp_name = opp_team["team"] if opp_team else ""
        our_points = our_team.get("points", 0)
        opp_points = opp_team.get("points", 0) if opp_team else 0

        # Collect all stats per athlete
        by_athlete: dict[str, dict[str, Any]] = {}
        for cat in our_team.get("categories", []):
            cat_name = cat.get("name", "").lower()
            for typ in cat.get("types", []):
                type_name = typ.get("name", "")
                field = STAT_MAP.get((cat_name, type_name))
                if field is None:
                    continue
                for athlete in typ.get("athletes", []):
                    aid = str(athlete.get("id", ""))
                    aname = athlete.get("name", "")
                    bucket = by_athlete.setdefault(aid, {
                        "athlete_id": aid,
                        "athlete_name": aname,
                        "team": target_team,
                        "opponent": opp_name,
                        "home_away": our_team.get("homeAway", ""),
                        "team_points": our_points,
                        "opp_points": opp_points,
                    })
                    raw_val = str(athlete.get("stat", "0"))
                    if field == "_c_att":
                        _parse_c_att(bucket, raw_val)
                    else:
                        bucket[field] = _safe_float(raw_val)

        rows.extend(by_athlete.values())
    return rows


def _parse_c_att(bucket: dict, raw: str) -> None:
    """Parse a 'C/ATT' string like '28/38' into completions and attempts."""
    parts = raw.split("/")
    if len(parts) == 2:
        bucket["completions"] = _safe_float(parts[0])
        bucket["pass_attempts"] = _safe_float(parts[1])
        att = bucket["pass_attempts"]
        if att and att > 0:
            bucket["completion_pct"] = round(bucket["completions"] / att * 100, 1)
        else:
            bucket["completion_pct"] = 0.0


def _safe_float(val: str) -> float:
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0


def fetch_all_games_for_team(
    team: str,
    year: int,
    season_types: list[str],
    max_week: int = 17,
    api_key: Optional[str] = None,
    cache_dir: str = "data/cache/tracker",
    rate_limit: float = 0.3,
) -> dict[int, list[dict[str, Any]]]:
    """Fetch game stats for every week of the season for one team.

    Parameters
    ----------
    team : str
    year : int
    season_types : list of str
    max_week : int
    api_key : str, optional
    cache_dir : str
    rate_limit : float

    Returns
    -------
    dict mapping week number to list of per-player stat dicts.
    """
    key = api_key or _load_api_key()
    by_week: dict[int, list[dict[str, Any]]] = {}
    for st in season_types:
        week_range = range(1, max_week + 1) if st == "regular" else range(1, 6)
        for week in week_range:
            rows = fetch_team_week_stats(team, year, week, st, key, cache_dir, rate_limit)
            if rows:
                by_week[week] = rows
    return by_week


def fetch_games_metadata(
    year: int,
    conference: str,
    season_type: str = "regular",
    api_key: Optional[str] = None,
    cache_dir: str = "data/cache/tracker",
    rate_limit: float = 0.3,
) -> list[dict[str, Any]]:
    """Fetch the games list (schedule/results) for a conference-season.

    Returns raw game dicts with fields like homeTeam, awayTeam, homePoints,
    awayPoints, week, startDate, homePregameElo, awayPregameElo, etc.
    """
    key = api_key or _load_api_key()
    cp = Path(cache_dir) / f"games_meta_{conference}_{year}_{season_type}.json"
    cp.parent.mkdir(parents=True, exist_ok=True)
    if cp.exists():
        with cp.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    data = _cfbd_get(key, "/games", {"year": year, "conference": conference, "seasonType": season_type})
    with cp.open("w", encoding="utf-8") as fh:
        json.dump(data, fh)
    time.sleep(rate_limit)
    return data


def build_game_context(
    games_meta: list[dict[str, Any]],
) -> dict[tuple[str, int], dict[str, Any]]:
    """Index games metadata by (team, week) for quick lookup.

    Returns dicts with keys: opponent, home_away, team_points, opp_points,
    date, team_result, opp_elo.
    """
    ctx: dict[tuple[str, int], dict[str, Any]] = {}
    for g in games_meta:
        week = g.get("week", 0)
        home = g.get("homeTeam", "")
        away = g.get("awayTeam", "")
        hp = g.get("homePoints") or 0
        ap = g.get("awayPoints") or 0
        date = (g.get("startDate") or "")[:10]

        home_elo = g.get("homePregameElo") or 1500
        away_elo = g.get("awayPregameElo") or 1500

        if hp > ap:
            home_result, away_result = "W", "L"
        elif ap > hp:
            home_result, away_result = "L", "W"
        else:
            home_result, away_result = "T", "T"

        ctx[(home, week)] = {
            "opponent": away,
            "home_away": "home",
            "team_points": hp,
            "opp_points": ap,
            "date": date,
            "team_result": home_result,
            "opp_elo": away_elo,
        }
        ctx[(away, week)] = {
            "opponent": home,
            "home_away": "away",
            "team_points": ap,
            "opp_points": hp,
            "date": date,
            "team_result": away_result,
            "opp_elo": home_elo,
        }
    return ctx
