"""Season-mode NIL prediction.

Loads a checkpoint and returns the predicted NIL value (USD) for one or more
players, given season-level stats from the dataset CSV.

Usage
-----
    python inference/predict_season.py --player "Garrett Nussmeier" --season 2025
    python inference/predict_season.py --all
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Optional

import pandas as pd

from data.preprocessing import load_dataset_csv
from training.evaluate import load_checkpoint, predict_usd


def predict_for_player(
    checkpoint: str | Path,
    dataset_csv: str | Path,
    player_name: str,
    school: Optional[str] = None,
) -> list[dict[str, object]]:
    """Predict NIL USD for every row matching a player name.

    Parameters
    ----------
    checkpoint : str or Path
    dataset_csv : str or Path
    player_name : str
        Matched case-insensitively on the ``name`` column.
    school : str, optional
        If supplied, also restrict to rows with this school.

    Returns
    -------
    list of dict
        One dict per matched row, with keys: ``name``, ``school``, ``position``,
        ``predicted_nil_usd``, ``actual_nil_usd``.
    """
    model, state, _ = load_checkpoint(checkpoint)
    df = load_dataset_csv(str(dataset_csv))
    mask = df["name"].str.lower() == player_name.lower().strip()
    if school:
        mask &= df["school"].str.lower() == school.lower().strip()
    matched = df.loc[mask].reset_index(drop=True)
    if matched.empty:
        return []
    preds = predict_usd(model, state, matched)
    out = []
    for i, row in matched.iterrows():
        out.append(
            {
                "name": row["name"],
                "school": row["school"],
                "position": row["position"],
                "predicted_nil_usd": float(preds[i]),
                "actual_nil_usd": (
                    float(row["nil_value_usd"]) if pd.notna(row["nil_value_usd"]) else None
                ),
            }
        )
    return out


def predict_all(
    checkpoint: str | Path,
    dataset_csv: str | Path,
) -> pd.DataFrame:
    """Predict NIL USD for every row in the dataset.

    Returns
    -------
    pd.DataFrame with columns name, school, position, predicted_nil_usd,
    actual_nil_usd.
    """
    model, state, _ = load_checkpoint(checkpoint)
    df = load_dataset_csv(str(dataset_csv))
    preds = predict_usd(model, state, df)
    out = df[["name", "school", "position", "nil_value_usd"]].copy()
    out = out.rename(columns={"nil_value_usd": "actual_nil_usd"})
    out["predicted_nil_usd"] = preds
    return out


def _main() -> None:
    parser = argparse.ArgumentParser(description="Predict season NIL valuations.")
    parser.add_argument(
        "--checkpoint", default="training/checkpoints/best.pt"
    )
    parser.add_argument("--dataset", default="data/sec_2025.csv")
    parser.add_argument("--player", default=None)
    parser.add_argument("--school", default=None)
    parser.add_argument("--season", type=int, default=None, help="Informational only.")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--output", default=None, help="Optional output JSON or CSV.")
    args = parser.parse_args()

    if args.all:
        df = predict_all(args.checkpoint, args.dataset)
        if args.output:
            out_path = Path(args.output)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            if out_path.suffix == ".csv":
                df.to_csv(out_path, index=False)
            else:
                df.to_json(out_path, orient="records", indent=2)
        else:
            print(df.to_string(index=False))
        return

    if not args.player:
        parser.error("--player is required unless --all is given")
    rows = predict_for_player(
        args.checkpoint, args.dataset, args.player, school=args.school
    )
    if not rows:
        print(f"No rows matched name={args.player!r} school={args.school!r}")
        return
    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with out_path.open("w", encoding="utf-8") as fh:
            json.dump(rows, fh, indent=2)
    else:
        for r in rows:
            actual = (
                f"{r['actual_nil_usd']:,.0f}" if r["actual_nil_usd"] is not None else "n/a"
            )
            print(
                f"{r['name']} ({r['school']}, {r['position']}): "
                f"pred=${r['predicted_nil_usd']:,.0f} actual=${actual}"
            )


if __name__ == "__main__":
    _main()
