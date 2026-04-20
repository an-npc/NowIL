"""End-to-end pipeline: load players, fetch stats, score, adjust, output JSON.

Usage
-----
    python -m tracker.pipeline
    python -m tracker.pipeline --player "Garrett Nussmeier"
    python -m tracker.pipeline --output tracker/output/nil_trajectories.json
"""

from __future__ import annotations

import argparse
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import yaml

from tracker.evaluation.baselines import load_baselines
from tracker.evaluation.nil_adjuster import AdjusterState, compute_nil_delta, create_state
from tracker.evaluation.performance_score import compute_performance_score
from tracker.ingest.fetch_game_stats import (
    build_game_context,
    fetch_all_games_for_team,
    fetch_games_metadata,
)
from tracker.ingest.load_players import TrackedPlayer, load_players

logger = logging.getLogger(__name__)

CONFIG_PATH = "tracker/config/tracker_config.yaml"


def load_config(path: str = CONFIG_PATH) -> dict[str, Any]:
    """Load the tracker YAML config."""
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def run_pipeline(
    config: dict[str, Any],
    player_filter: Optional[str] = None,
    output_path: str = "tracker/output/nil_trajectories.json",
) -> dict[str, Any]:
    """Run the full tracker pipeline.

    Parameters
    ----------
    config : dict
        Loaded tracker config.
    player_filter : str, optional
        If set, only process the player whose name matches (case-insensitive).
    output_path : str
        Where to write the output JSON.

    Returns
    -------
    dict
        The output payload (also written to disk).
    """
    from dotenv import load_dotenv
    load_dotenv()

    season = int(config["season"])
    conference = config["conference"]
    season_types = config.get("season_types", ["regular"])
    cfbd_cfg = config.get("cfbd", {})
    cache_dir = cfbd_cfg.get("cache_dir", "data/cache/tracker")
    rate_limit = float(cfbd_cfg.get("rate_limit_seconds", 0.3))
    adj_cfg = config.get("adjustment", {})

    baselines = load_baselines(config)

    # Load players
    players = load_players()
    if player_filter:
        players = [p for p in players if player_filter.lower() in p.name.lower()]
    if not players:
        logger.warning("No players matched filter=%r", player_filter)
        return {"players": []}

    logger.info("Processing %d players", len(players))

    # Fetch games metadata for opponent context
    all_games_meta: list[dict[str, Any]] = []
    for st in season_types:
        all_games_meta.extend(fetch_games_metadata(season, conference, st, cache_dir=cache_dir, rate_limit=rate_limit))
    game_ctx = build_game_context(all_games_meta)

    # Determine total weeks for recency scaling
    all_weeks = {g.get("week", 0) for g in all_games_meta}
    total_weeks = max(all_weeks) if all_weeks else 15

    # Group players by team to batch API calls
    by_team: dict[str, list[TrackedPlayer]] = {}
    for p in players:
        by_team.setdefault(p.school, []).append(p)

    # Fetch game stats per team (cached)
    team_game_stats: dict[str, dict[int, list[dict[str, Any]]]] = {}
    for team in by_team:
        logger.info("Fetching game stats for %s", team)
        team_game_stats[team] = fetch_all_games_for_team(
            team, season, season_types,
            cache_dir=cache_dir, rate_limit=rate_limit,
        )

    # Process each player
    output_players: list[dict[str, Any]] = []
    for player in players:
        baseline = baselines.get(player.position)
        if baseline is None:
            logger.warning("No baseline for position %s, skipping %s", player.position, player.name)
            continue

        state = create_state(player.initial_nil)
        team_stats = team_game_stats.get(player.school, {})
        games_output: list[dict[str, Any]] = []

        for week in sorted(team_stats.keys()):
            week_rows = team_stats[week]
            # Find this player's stats in this week
            player_row = _find_player_row(player, week_rows)
            if player_row is None:
                continue

            # Get game context
            ctx = game_ctx.get((player.school, week), {})
            opp_elo = float(ctx.get("opp_elo", 1500))
            team_result = ctx.get("team_result", "")
            opponent = ctx.get("opponent", player_row.get("opponent", ""))
            date = ctx.get("date", "")

            # Filter stats for output
            stat_fields = {s.name for s in baseline.stats}
            game_stat_output = {k: player_row.get(k, 0.0) for k in stat_fields}
            # Add completion_pct for QBs if available
            if player.position == "QB" and "completion_pct" in player_row:
                game_stat_output["completion_pct"] = player_row["completion_pct"]

            # Score
            perf_score = compute_performance_score(
                player_row, baseline,
                opp_elo=opp_elo,
                team_result=team_result,
                adjustment_cfg=adj_cfg,
            )

            # Adjust NIL
            delta = compute_nil_delta(state, perf_score, week, total_weeks, adj_cfg)

            games_output.append({
                "week": week,
                "opponent": opponent,
                "date": date,
                "team_result": team_result,
                "stats": game_stat_output,
                "performance_score": round(perf_score, 4),
                "nil_delta": round(delta),
                "nil_value_after_game": round(state.current_nil),
            })

        output_players.append({
            "name": player.name,
            "team": player.school,
            "position": player.position,
            "initial_nil_value": player.initial_nil,
            "final_nil_value": round(state.current_nil),
            "total_change": round(state.current_nil - player.initial_nil),
            "total_change_pct": round((state.current_nil - player.initial_nil) / max(player.initial_nil, 1) * 100, 1),
            "games_played": len(games_output),
            "games": games_output,
        })

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "season": season,
        "conference": conference,
        "total_players": len(output_players),
        "players": output_players,
    }

    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
    logger.info("Wrote %d player trajectories to %s", len(output_players), out)

    return payload


def _find_player_row(
    player: TrackedPlayer,
    week_rows: list[dict[str, Any]],
) -> Optional[dict[str, Any]]:
    """Find the stat row for a player in a week's game data.

    Matches on athlete name (case-insensitive) since ESPN IDs in the game
    stats may not align with the player_id in players.json.
    """
    target = player.name.lower().strip()
    for row in week_rows:
        if (row.get("athlete_name") or "").lower().strip() == target:
            return row
    # Try matching on ESPN ID
    for row in week_rows:
        if row.get("athlete_id") == player.espn_id:
            return row
    return None


def _main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    parser = argparse.ArgumentParser(description="Game-by-game NIL tracker pipeline.")
    parser.add_argument("--config", default=CONFIG_PATH)
    parser.add_argument("--player", default=None, help="Filter to a single player name.")
    parser.add_argument("--output", default="tracker/output/nil_trajectories.json")
    args = parser.parse_args()

    config = load_config(args.config)
    payload = run_pipeline(config, player_filter=args.player, output_path=args.output)

    # Print summary
    for p in payload.get("players", []):
        change = p["total_change"]
        sign = "+" if change >= 0 else ""
        print(
            f"{p['name']:25s} {p['team']:15s} {p['position']:3s}  "
            f"${p['initial_nil_value']:>10,d} -> ${p['final_nil_value']:>10,d}  "
            f"({sign}{p['total_change_pct']}%)  {p['games_played']} games"
        )


if __name__ == "__main__":
    _main()
