"""Real-time NIL prediction from recent games.

Given a player and the last N game stat rows (loaded from a per-game CSV),
combines:

1. The season-level prediction from the trained embedding model.
2. A log-space adjustment from the LSTM head.

If the LSTM has not been trained, the adjustment is zero and the output
equals the season-mode prediction. This makes the script safe to run even
before the LSTM is fit.

Usage
-----
    python inference/predict_realtime.py --player "Garrett Nussmeier" --last-n-games 3
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
import torch

from data.preprocessing import inverse_transform_target, transform_features
from inference.predict_season import predict_for_player
from models.lstm_realtime import LSTMAdjustmentConfig, LSTMAdjustmentHead, pad_game_sequence
from training.evaluate import load_checkpoint


GAME_FEATURE_ORDER = [
    "pass_attempts",
    "pass_completions",
    "pass_yards",
    "pass_tds",
    "pass_ints_thrown",
    "rush_attempts",
    "rush_yards",
    "rush_tds",
    "receptions",
    "targets",
    "receiving_yards",
    "receiving_tds",
    "total_tackles",
    "solo_tackles",
    "tfl",
    "sacks",
    "def_ints",
    "pass_breakups",
    "forced_fumbles",
]


def load_recent_games(
    games_csv: str | Path,
    player_name: str,
    school: Optional[str],
    last_n: int,
) -> pd.DataFrame:
    """Load the most recent N games for a player from a game-stats CSV.

    The CSV must have columns: ``player_id``, ``name``, ``school``, ``season``,
    ``week``, plus the feature columns in ``GAME_FEATURE_ORDER``.

    Parameters
    ----------
    games_csv : str or Path
    player_name : str
    school : str, optional
    last_n : int

    Returns
    -------
    pd.DataFrame
        Sorted chronologically (oldest first). May have fewer than ``last_n``
        rows; the LSTM input is left-padded.
    """
    df = pd.read_csv(games_csv)
    mask = df["name"].str.lower() == player_name.lower().strip()
    if school:
        mask &= df["school"].str.lower() == school.lower().strip()
    df = df.loc[mask].sort_values(["season", "week"]).reset_index(drop=True)
    if last_n > 0:
        df = df.tail(last_n).reset_index(drop=True)
    return df


def predict_realtime(
    checkpoint: str | Path,
    dataset_csv: str | Path,
    games_csv: Optional[str | Path],
    player_name: str,
    last_n: int,
    school: Optional[str] = None,
    lstm_checkpoint: Optional[str | Path] = None,
) -> dict[str, object]:
    """Return the season prediction plus real-time adjustment.

    Parameters
    ----------
    checkpoint : str or Path
        Season model checkpoint.
    dataset_csv : str or Path
        Season-level dataset CSV.
    games_csv : str or Path, optional
        Per-game stats CSV. If None, no adjustment is applied.
    player_name : str
    last_n : int
    school : str, optional
    lstm_checkpoint : str or Path, optional
        Trained LSTM head. If None, adjustment is zero.

    Returns
    -------
    dict with keys name, school, position, season_pred_usd,
    realtime_adjustment_log, realtime_pred_usd.
    """
    season_rows = predict_for_player(
        checkpoint, dataset_csv, player_name, school=school
    )
    if not season_rows:
        return {}
    row = season_rows[0]
    season_pred_usd = float(row["predicted_nil_usd"])

    adjustment = 0.0
    if games_csv is not None and lstm_checkpoint is not None:
        _, state, cfg = load_checkpoint(checkpoint)
        lstm_cfg = cfg.get("lstm", {})
        lstm_model_cfg = LSTMAdjustmentConfig(
            num_positions=len(state.position_order),
            position_embedding_dim=int(cfg["model"]["position_embedding_dim"]),
            game_feature_dim=len(GAME_FEATURE_ORDER),
            sequence_length=int(lstm_cfg.get("sequence_length", 5)),
            hidden_dim=int(lstm_cfg.get("hidden_dim", 32)),
            num_layers=int(lstm_cfg.get("num_layers", 1)),
            dropout=float(lstm_cfg.get("dropout", 0.1)),
        )
        head = LSTMAdjustmentHead(lstm_model_cfg)
        head.load_state_dict(torch.load(lstm_checkpoint, map_location="cpu"))
        head.eval()

        games = load_recent_games(games_csv, player_name, school, last_n)
        game_tensors = [
            torch.tensor(
                [float(row_g.get(c, 0.0) or 0.0) for c in GAME_FEATURE_ORDER],
                dtype=torch.float32,
            )
            for _, row_g in games.iterrows()
        ]
        padded = pad_game_sequence(
            game_tensors,
            sequence_length=lstm_model_cfg.sequence_length,
            feature_dim=lstm_model_cfg.game_feature_dim,
        ).unsqueeze(0)
        pos_idx = state.position_order.index(row["position"])
        with torch.no_grad():
            adj = head(torch.tensor([pos_idx], dtype=torch.long), padded)
        adjustment = float(adj.item())

    # Apply adjustment in log-space.
    log_pred = np.log1p(max(season_pred_usd, 0.0))
    adjusted_log = log_pred + adjustment
    realtime_usd = float(np.expm1(adjusted_log))

    return {
        "name": row["name"],
        "school": row["school"],
        "position": row["position"],
        "season_pred_usd": season_pred_usd,
        "realtime_adjustment_log": adjustment,
        "realtime_pred_usd": realtime_usd,
    }


def _main() -> None:
    parser = argparse.ArgumentParser(description="Real-time NIL prediction.")
    parser.add_argument(
        "--checkpoint", default="training/checkpoints/best.pt"
    )
    parser.add_argument("--dataset", default="data/sec_2025.csv")
    parser.add_argument("--games", default="data/cache/game_stats.csv")
    parser.add_argument(
        "--lstm-checkpoint", default=None,
        help="Optional LSTM head checkpoint. If omitted, adjustment is zero.",
    )
    parser.add_argument("--player", required=True)
    parser.add_argument("--school", default=None)
    parser.add_argument("--last-n-games", type=int, default=5)
    args = parser.parse_args()

    result = predict_realtime(
        checkpoint=args.checkpoint,
        dataset_csv=args.dataset,
        games_csv=args.games if args.lstm_checkpoint else None,
        player_name=args.player,
        last_n=args.last_n_games,
        school=args.school,
        lstm_checkpoint=args.lstm_checkpoint,
    )
    if not result:
        print(f"No match for player={args.player!r}")
        return
    print(
        f"{result['name']} ({result['school']}, {result['position']}): "
        f"season=${result['season_pred_usd']:,.0f} "
        f"realtime=${result['realtime_pred_usd']:,.0f} "
        f"log_adjustment={result['realtime_adjustment_log']:+.3f}"
    )


if __name__ == "__main__":
    _main()
