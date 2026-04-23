"""Training loop with k-fold cross-validation.

Responsibilities
----------------
- Load the dataset CSV, filter to trainable rows.
- Build stratified k-fold splits over position ids.
- Per fold: fit the preprocessor on train, transform both splits, train the
  PyTorch embedding model with early stopping on validation loss, save the
  best checkpoint and preprocessor state to ``training/checkpoints/``.
- Emit a summary JSON with per-fold train and val loss and MAE metrics.

Usage
-----
    python training/train.py --config config/sec_football_config.yaml
"""

from __future__ import annotations

import argparse
import json
import random
from dataclasses import asdict
from pathlib import Path
from typing import Any

import numpy as np
import torch
import yaml
from torch.utils.data import DataLoader, TensorDataset

from data.preprocessing import (
    PreprocessState,
    filter_trainable,
    fit_preprocessor,
    inverse_transform_target,
    load_dataset_csv,
    stratified_kfold_indices,
    transform_features,
    transform_target,
)
from models.nil_model import NILModel, NILModelConfig, build_huber_loss


def set_seed(seed: int) -> None:
    """Seed Python, NumPy, and PyTorch RNGs for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)


def train_one_fold(
    train_df: Any,
    val_df: Any,
    cfg: dict[str, Any],
    device: torch.device,
) -> dict[str, Any]:
    """Fit the preprocessor and model on one train/val split.

    Parameters
    ----------
    train_df, val_df : pd.DataFrame
    cfg : dict
        Loaded config YAML.
    device : torch.device

    Returns
    -------
    dict
        Keys: ``state_dict`` (model weights), ``preprocessor`` (dict),
        ``best_val_loss``, ``best_val_mae_usd``.
    """
    position_order = list(cfg["positions"])
    stat_order = list(cfg["stat_feature_order"])
    context_order = list(cfg["context_features"])

    state = fit_preprocessor(
        df=train_df,
        position_order=position_order,
        stat_feature_order=stat_order,
        context_feature_order=context_order,
        target_log=bool(cfg["model"]["log_target"]),
    )

    train_pos, train_X = transform_features(train_df, state)
    val_pos, val_X = transform_features(val_df, state)
    train_y = transform_target(train_df["nil_value_usd"].to_numpy(dtype=np.float64), state)
    val_y = transform_target(val_df["nil_value_usd"].to_numpy(dtype=np.float64), state)

    train_ds = TensorDataset(
        torch.from_numpy(train_pos),
        torch.from_numpy(train_X),
        torch.from_numpy(train_y),
    )
    val_ds = TensorDataset(
        torch.from_numpy(val_pos),
        torch.from_numpy(val_X),
        torch.from_numpy(val_y),
    )
    batch_size = int(cfg["training"]["batch_size"])
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)

    model_cfg = NILModelConfig(
        num_positions=len(position_order),
        position_embedding_dim=int(cfg["model"]["position_embedding_dim"]),
        numeric_feature_dim=train_X.shape[1],
        hidden_layers=tuple(cfg["model"]["hidden_layers"]),
        dropout=float(cfg["model"]["dropout"]),
        activation=str(cfg["model"]["activation"]),
    )
    model = NILModel(model_cfg).to(device)
    loss_fn = build_huber_loss(float(cfg["model"]["huber_delta"]))
    optim = torch.optim.AdamW(
        model.parameters(),
        lr=float(cfg["training"]["learning_rate"]),
        weight_decay=float(cfg["training"]["weight_decay"]),
    )

    best_val = float("inf")
    best_state: dict[str, Any] = {}
    patience = int(cfg["training"]["patience"])
    epochs = int(cfg["training"]["epochs"])
    bad_epochs = 0

    for epoch in range(epochs):
        model.train()
        for pos_ids, feats, targets in train_loader:
            pos_ids = pos_ids.to(device)
            feats = feats.to(device)
            targets = targets.to(device)
            optim.zero_grad()
            preds = model(pos_ids, feats)
            loss = loss_fn(preds, targets)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5.0)
            optim.step()

        model.eval()
        total_loss = 0.0
        count = 0
        with torch.no_grad():
            for pos_ids, feats, targets in val_loader:
                pos_ids = pos_ids.to(device)
                feats = feats.to(device)
                targets = targets.to(device)
                preds = model(pos_ids, feats)
                loss = loss_fn(preds, targets)
                total_loss += float(loss.item()) * pos_ids.shape[0]
                count += pos_ids.shape[0]
        val_loss = total_loss / max(count, 1)
        if val_loss < best_val - 1e-6:
            best_val = val_loss
            best_state = {k: v.detach().cpu().clone() for k, v in model.state_dict().items()}
            bad_epochs = 0
        else:
            bad_epochs += 1
            if bad_epochs >= patience:
                break

    # Compute best-model MAE in USD on validation.
    model.load_state_dict(best_state)
    model.eval()
    with torch.no_grad():
        preds_log = []
        for pos_ids, feats, _ in val_loader:
            pos_ids = pos_ids.to(device)
            feats = feats.to(device)
            preds_log.append(model(pos_ids, feats).cpu().numpy())
    preds_log_arr = np.concatenate(preds_log) if preds_log else np.zeros(0, dtype=np.float32)
    preds_usd = inverse_transform_target(preds_log_arr, state)
    actuals_usd = val_df["nil_value_usd"].to_numpy(dtype=np.float32)
    mae_usd = float(np.mean(np.abs(preds_usd - actuals_usd))) if actuals_usd.size else float("nan")

    return {
        "state_dict": best_state,
        "preprocessor": state.to_dict(),
        "best_val_loss": best_val,
        "best_val_mae_usd": mae_usd,
    }


def _main() -> None:
    parser = argparse.ArgumentParser(description="Train the NIL model with k-fold CV.")
    parser.add_argument("--config", default="config/sec_football_config.yaml")
    parser.add_argument("--dataset", default=None, help="Override dataset CSV path.")
    parser.add_argument("--output-dir", default=None, help="Override checkpoint dir.")
    args = parser.parse_args()

    with open(args.config, "r", encoding="utf-8") as fh:
        cfg = yaml.safe_load(fh)

    set_seed(int(cfg["training"]["seed"]))
    device = torch.device(str(cfg["training"]["device"]))

    dataset_path = args.dataset or cfg["paths"]["dataset_csv"]
    df = load_dataset_csv(dataset_path)
    df = filter_trainable(df)

    if len(df) < int(cfg["training"]["k_folds"]):
        raise RuntimeError(
            f"Only {len(df)} trainable rows; fewer than k_folds="
            f"{cfg['training']['k_folds']}. Add more labels to on3_manual.csv."
        )

    position_order = list(cfg["positions"])
    pos_ids = np.array([position_order.index(p) for p in df["position"]], dtype=np.int64)
    folds = stratified_kfold_indices(
        pos_ids,
        k=int(cfg["training"]["k_folds"]),
        seed=int(cfg["training"]["seed"]),
    )

    out_dir = Path(args.output_dir or cfg["paths"]["checkpoint_dir"])
    out_dir.mkdir(parents=True, exist_ok=True)

    fold_summaries: list[dict[str, Any]] = []
    best_fold_idx = -1
    best_fold_loss = float("inf")

    for i, (train_idx, val_idx) in enumerate(folds):
        train_df = df.iloc[train_idx].reset_index(drop=True)
        val_df = df.iloc[val_idx].reset_index(drop=True)
        result = train_one_fold(train_df, val_df, cfg, device)
        ckpt_path = out_dir / f"fold_{i}.pt"
        torch.save(
            {
                "state_dict": result["state_dict"],
                "preprocessor": result["preprocessor"],
                "config": cfg,
                "numeric_feature_dim": len(cfg["stat_feature_order"]) + len(cfg["context_features"]),
            },
            ckpt_path,
        )
        fold_summaries.append(
            {
                "fold": i,
                "best_val_loss": result["best_val_loss"],
                "best_val_mae_usd": result["best_val_mae_usd"],
                "n_train": int(len(train_df)),
                "n_val": int(len(val_df)),
                "checkpoint": str(ckpt_path),
            }
        )
        print(
            f"fold {i}: val_loss={result['best_val_loss']:.4f} "
            f"val_mae_usd={result['best_val_mae_usd']:.0f} "
            f"n_train={len(train_df)} n_val={len(val_df)}"
        )
        if result["best_val_loss"] < best_fold_loss:
            best_fold_loss = result["best_val_loss"]
            best_fold_idx = i

    if best_fold_idx >= 0:
        best_src = out_dir / f"fold_{best_fold_idx}.pt"
        best_dst = out_dir / "best.pt"
        best_dst.write_bytes(best_src.read_bytes())
        print(f"best fold={best_fold_idx} -> {best_dst}")

    summary = {
        "folds": fold_summaries,
        "best_fold": best_fold_idx,
        "mean_val_mae_usd": float(
            np.mean([f["best_val_mae_usd"] for f in fold_summaries])
        ) if fold_summaries else float("nan"),
    }
    with (out_dir / "training_summary.json").open("w", encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2)


if __name__ == "__main__":
    _main()
