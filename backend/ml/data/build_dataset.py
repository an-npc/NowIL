"""Join ingested data into a single training CSV.

Inputs
------
- CFBD roster and season stats, cached at ``data/cache/cfbd_rosters_stats.json``
  by ``data/ingest/cfbd_client.py``.
- On3 labels from ``data/cache/on3_manual.csv``.
- Knight-Newhouse revenue at ``data/cache/knight_newhouse_sec.csv``.
- Social follower counts at ``data/cache/social_followers.csv`` (optional).
- Team records; can be computed from CFBD or cached manually at
  ``data/cache/team_records.csv`` with columns ``school,wins,losses,sos``.

Output
------
A wide CSV where each row is a single ``NILRecord``, ready for preprocessing.

The join is left-driven by the CFBD roster. Players without a public NIL
valuation are emitted with ``nil_value_usd`` blank, and the training loop
will filter them out (still useful for inference).
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path
from typing import Any, Optional

import yaml

from data.ingest.knight_newhouse import load_school_revenue
from data.ingest.on3_scraper import index_by_name_school, load_manual_csv
from data.ingest.social_media import load_follower_counts
from data.schema import CLASS_YEAR_ORDINAL, NILRecord, Player, SeasonStats


def load_cfbd_cache(
    path: str | Path,
) -> tuple[list[Player], dict[str, SeasonStats], dict[str, dict[str, float]]]:
    """Load a CFBD cache JSON written by ``cfbd_client._main``.

    Returns
    -------
    (list of Player, dict of stats, dict of team_records)
    """
    path = Path(path)
    with path.open("r", encoding="utf-8") as fh:
        payload = json.load(fh)
    players = [Player.model_validate(r) for r in payload.get("roster", [])]
    stats = {s["player_id"]: SeasonStats.model_validate(s) for s in payload.get("season_stats", [])}
    team_records = payload.get("team_records", {})
    return players, stats, team_records


def load_team_records(path: str | Path) -> dict[str, dict[str, float]]:
    """Load team win percentage and strength of schedule from a CSV cache.

    Expected columns: ``school``, ``wins``, ``losses``, ``sos``. Win pct is
    computed as wins / (wins + losses), clamped to [0, 1]. SoS is passed
    through.

    Parameters
    ----------
    path : str or Path

    Returns
    -------
    dict
        Maps school to ``{"team_win_pct": float, "sos": float}``.
    """
    path = Path(path)
    if not path.exists():
        return {}
    out: dict[str, dict[str, float]] = {}
    with path.open("r", encoding="utf-8", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            school = (row.get("school") or "").strip()
            if not school:
                continue
            wins = _safe_int(row.get("wins")) or 0
            losses = _safe_int(row.get("losses")) or 0
            total = wins + losses
            pct = wins / total if total > 0 else 0.0
            sos = _safe_float(row.get("sos")) or 0.0
            out[school] = {"team_win_pct": pct, "sos": sos}
    return out


def build_records(
    players: list[Player],
    stats_by_id: dict[str, SeasonStats],
    nil_labels: dict[tuple[str, str], Any],
    team_records: dict[str, dict[str, float]],
    revenue_by_school: dict[str, float],
    followers: dict[tuple[str, str], Optional[float]],
    season: int,
) -> list[NILRecord]:
    """Join sources into a list of ``NILRecord``.

    Parameters
    ----------
    players : list of Player
    stats_by_id : dict of player_id to SeasonStats
    nil_labels : dict of (name_lower, school_lower) to NILLabel
    team_records : dict of school to record dict
    revenue_by_school : dict of school to USD revenue
    followers : dict of (name_lower, school_lower) to total follower count or None
    season : int

    Returns
    -------
    list of NILRecord
    """
    records: list[NILRecord] = []
    for player in players:
        stats = stats_by_id.get(player.player_id) or SeasonStats(
            player_id=player.player_id,
            season=season,
        )
        key = (player.name.lower().strip(), player.school.lower().strip())
        label = nil_labels.get(key)
        trec = team_records.get(player.school, {})
        rec = NILRecord(
            player=player,
            stats=stats,
            team_win_pct=float(trec.get("team_win_pct", 0.0)),
            team_strength_of_schedule=float(trec.get("sos", 0.0)),
            school_athletic_revenue_usd=revenue_by_school.get(player.school),
            social_followers_total=followers.get(key),
            nil_value_usd=float(label.nil_value_usd) if label is not None else None,
        )
        records.append(rec)
    return records


def write_dataset_csv(records: list[NILRecord], path: str | Path) -> None:
    """Flatten records into a wide CSV suitable for preprocessing.

    Columns
    -------
    - ``player_id``, ``name``, ``school``, ``position``, ``class_year_ordinal``,
      ``games_played``
    - all stat fields from SeasonStats
    - ``team_win_pct``, ``team_strength_of_schedule``,
      ``school_athletic_revenue_usd``, ``social_followers_total``
    - ``nil_value_usd``

    Parameters
    ----------
    records : list of NILRecord
    path : str or Path
    """
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)

    stat_fields = [
        f for f in SeasonStats.model_fields.keys() if f not in {"player_id", "season", "games_played"}
    ]

    header = [
        "player_id",
        "name",
        "school",
        "position",
        "class_year_ordinal",
        "games_played",
        *stat_fields,
        "team_win_pct",
        "team_strength_of_schedule",
        "school_athletic_revenue_usd",
        "social_followers_total",
        "nil_value_usd",
    ]

    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(header)
        for rec in records:
            row: list[Any] = [
                rec.player.player_id,
                rec.player.name,
                rec.player.school,
                rec.player.position,
                CLASS_YEAR_ORDINAL.get(rec.player.class_year or "", ""),
                rec.stats.games_played,
            ]
            for field in stat_fields:
                row.append(getattr(rec.stats, field))
            row.extend(
                [
                    rec.team_win_pct,
                    rec.team_strength_of_schedule,
                    _blank_if_none(rec.school_athletic_revenue_usd),
                    _blank_if_none(rec.social_followers_total),
                    _blank_if_none(rec.nil_value_usd),
                ]
            )
            writer.writerow(row)


def _blank_if_none(value: Optional[float]) -> Any:
    return "" if value is None else value


def _safe_int(value: Optional[str]) -> Optional[int]:
    if value is None or value.strip() == "":
        return None
    try:
        return int(value)
    except ValueError:
        return None


def _safe_float(value: Optional[str]) -> Optional[float]:
    if value is None or value.strip() == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def _main() -> None:
    parser = argparse.ArgumentParser(description="Join ingested sources into the training CSV.")
    parser.add_argument("--config", default="config/sec_football_config.yaml")
    parser.add_argument("--cfbd-cache", default="data/cache/cfbd_rosters_stats.json")
    parser.add_argument("--output", default="data/sec_2025.csv")
    args = parser.parse_args()

    with open(args.config, "r", encoding="utf-8") as fh:
        cfg = yaml.safe_load(fh)
    season = int(cfg["season"])
    sec_teams = cfg["sec_teams"]
    paths = cfg["paths"]

    players, stats_by_id, cfbd_team_records = load_cfbd_cache(args.cfbd_cache)
    nil_labels = index_by_name_school(load_manual_csv(paths["on3_manual_csv"]))
    team_records = cfbd_team_records or load_team_records("data/cache/team_records.csv")
    revenue_by_school = load_school_revenue(
        paths["knight_newhouse_csv"],
        fiscal_year=season,
        sec_teams=sec_teams,
    )
    followers = load_follower_counts(paths["social_followers_csv"])

    records = build_records(
        players=players,
        stats_by_id=stats_by_id,
        nil_labels=nil_labels,
        team_records=team_records,
        revenue_by_school=revenue_by_school,
        followers=followers,
        season=season,
    )
    write_dataset_csv(records, args.output)
    trainable = sum(1 for r in records if r.is_trainable())
    print(
        f"Wrote {len(records)} rows ({trainable} labeled) to {args.output}"
    )


if __name__ == "__main__":
    _main()
