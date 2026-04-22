"""Evaluate a trained checkpoint on the dataset.

Reports MAE, RMSE, MAPE overall and per-position. Because NIL valuations
span several orders of magnitude, MAPE is reported with a floor to avoid
divide-by-zero; small-valuation players are reported separately.

Usage
-----
    python training/evaluate.py --checkpoint training/checkpoints/best.pt
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import numpy as np
import torch

from data.preprocessing import (
    PreprocessState,
    filter_trainable,
    inverse_transform_target,
    load_dataset_csv,
    transform_features,
)
from models.nil_model import NILModel, NILModelConfig


def load_checkpoint(path: str | Path) -> tuple[NILModel, PreprocessState, dict[str, Any]]:
    """Load a training checkpoint saved by ``training/train.py``.

    Parameters
    ----------
    path : str or Path

    Returns
    -------
    (NILModel, PreprocessState, config)
    """
    payload = torch.load(path, map_location="cpu", weights_only=False)
    cfg = payload["config"]
    state = PreprocessState.from_dict(payload["preprocessor"])
    model_cfg = NILModelConfig(
        num_positions=len(state.position_order),
        position_embedding_dim=int(cfg["model"]["position_embedding_dim"]),
        numeric_feature_dim=int(payload["numeric_feature_dim"]),
        hidden_layers=tuple(cfg["model"]["hidden_layers"]),
        dropout=float(cfg["model"]["dropout"]),
        activation=str(cfg["model"]["activation"]),
    )
    model = NILModel(model_cfg)
    model.load_state_dict(payload["state_dict"])
    model.eval()
    return model, state, cfg


def predict_usd(model: NILModel, state: PreprocessState, df: Any) -> np.ndarray:
    """Run the model over a DataFrame and return USD predictions.

    Parameters
    ----------
    model : NILModel
    state : PreprocessState
    df : pd.DataFrame

    Returns
    -------
    np.ndarray of float32
    """
    pos_ids, features = transform_features(df, state)
    with torch.no_grad():
        preds_log = model(
            torch.from_numpy(pos_ids),
            torch.from_numpy(features),
        ).cpu().numpy()
    return inverse_transform_target(preds_log, state)


def metrics(
    preds_usd: np.ndarray,
    actuals_usd: np.ndarray,
    mape_floor: float = 10_000.0,
) -> dict[str, float]:
    """Compute MAE, RMSE, MAPE.

    MAPE is computed with a floor on the denominator to avoid divide-by-zero
    on zero or near-zero ground-truth values.

    Parameters
    ----------
    preds_usd, actuals_usd : np.ndarray
    mape_floor : float, default 10_000.0
        Minimum denominator in USD used by the MAPE calculation.

    Returns
    -------
    dict
        Keys: ``mae``, ``rmse``, ``mape``, ``n``.
    """
    if actuals_usd.size == 0:
        return {"mae": float("nan"), "rmse": float("nan"), "mape": float("nan"), "n": 0}
    mae = float(np.mean(np.abs(preds_usd - actuals_usd)))
    rmse = float(np.sqrt(np.mean((preds_usd - actuals_usd) ** 2)))
    denom = np.maximum(np.abs(actuals_usd), mape_floor)
    mape = float(np.mean(np.abs((preds_usd - actuals_usd) / denom)) * 100.0)
    return {"mae": mae, "rmse": rmse, "mape": mape, "n": int(actuals_usd.size)}


def _main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate a trained NIL checkpoint.")
    parser.add_argument("--checkpoint", required=True)
    parser.add_argument("--dataset", default=None)
    args = parser.parse_args()

    model, state, cfg = load_checkpoint(args.checkpoint)
    dataset_path = args.dataset or cfg["paths"]["dataset_csv"]
    df = load_dataset_csv(dataset_path)
    df = filter_trainable(df)
    if len(df) == 0:
        print("No trainable rows to evaluate.")
        return

    preds = predict_usd(model, state, df)
    actuals = df["nil_value_usd"].to_numpy(dtype=np.float32)
    overall = metrics(preds, actuals)
    print(f"overall: mae={overall['mae']:,.0f} rmse={overall['rmse']:,.0f} "
          f"mape={overall['mape']:.1f}% n={overall['n']}")

    per_position: dict[str, dict[str, float]] = {}
    for pos in state.position_order:
        mask = (df["position"] == pos).to_numpy()
        m = metrics(preds[mask], actuals[mask])
        per_position[pos] = m
        print(
            f"  {pos}: mae={m['mae']:,.0f} rmse={m['rmse']:,.0f} "
            f"mape={m['mape']:.1f}% n={m['n']}"
        )

    report = {"overall": overall, "per_position": per_position}
    out_path = Path(args.checkpoint).with_suffix(".eval.json")
    with out_path.open("w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2)
    print(f"wrote {out_path}")


if __name__ == "__main__":
    _main()
