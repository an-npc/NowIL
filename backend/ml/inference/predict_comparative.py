"""Comparison-based NIL estimation.

For players without a known NIL value, this module finds the most similar
labeled players (within the same position) using normalized feature distance,
then produces a similarity-weighted average of their real NIL values.

This grounds every prediction in actual market data rather than allowing the
model to extrapolate unconstrained. The output for each unlabeled player
includes:

- The estimated NIL value (weighted average of comparable players).
- The comparable players used and their similarity scores.
- A confidence band based on the spread of the comparables.

Usage
-----
    python -m inference.predict_comparative --all --output data/comparative_predictions.csv
    python -m inference.predict_comparative --player "Diego Pavia"
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd

from data.preprocessing import (
    PreprocessState,
    fit_preprocessor,
    load_dataset_csv,
    transform_features,
)
from training.evaluate import load_checkpoint


def find_comparables(
    player_features: np.ndarray,
    player_position_id: int,
    ref_features: np.ndarray,
    ref_position_ids: np.ndarray,
    ref_nil_values: np.ndarray,
    ref_names: list[str],
    ref_schools: list[str],
    k: int = 5,
    same_position_only: bool = True,
) -> list[dict]:
    """Find the k most similar labeled players for a single unlabeled player.

    Parameters
    ----------
    player_features : np.ndarray, shape (F,)
        Normalized feature vector for the player being evaluated.
    player_position_id : int
        Position id of the player.
    ref_features : np.ndarray, shape (N_ref, F)
        Normalized features for all labeled (reference) players.
    ref_position_ids : np.ndarray, shape (N_ref,)
        Position ids for reference players.
    ref_nil_values : np.ndarray, shape (N_ref,)
        Actual NIL values in USD for reference players.
    ref_names : list of str
    ref_schools : list of str
    k : int
        Number of comparables to return.
    same_position_only : bool
        If True, only compare within the same position group.

    Returns
    -------
    list of dict
        Each dict has keys: name, school, nil_value_usd, similarity, distance.
        Sorted by similarity (highest first).
    """
    if same_position_only:
        mask = ref_position_ids == player_position_id
        r_feat = ref_features[mask]
        r_nil = ref_nil_values[mask]
        r_names = [ref_names[i] for i, m in enumerate(mask) if m]
        r_schools = [ref_schools[i] for i, m in enumerate(mask) if m]
    else:
        r_feat = ref_features
        r_nil = ref_nil_values
        r_names = ref_names
        r_schools = ref_schools

    if len(r_feat) == 0:
        return []

    # Euclidean distance in normalized feature space
    diffs = r_feat - player_features[np.newaxis, :]
    distances = np.sqrt(np.sum(diffs ** 2, axis=1))

    # Convert distance to similarity (inverse, with softmax-style normalization)
    # Add small epsilon to avoid division by zero
    similarities = 1.0 / (1.0 + distances)

    # Sort by similarity descending
    order = np.argsort(-similarities)
    top_k = order[:k]

    comparables = []
    for idx in top_k:
        comparables.append({
            "name": r_names[idx],
            "school": r_schools[idx],
            "nil_value_usd": float(r_nil[idx]),
            "similarity": float(similarities[idx]),
            "distance": float(distances[idx]),
        })
    return comparables


def estimate_nil_from_comparables(comparables: list[dict]) -> dict:
    """Compute a similarity-weighted NIL estimate from comparable players.

    Parameters
    ----------
    comparables : list of dict
        Output of ``find_comparables``.

    Returns
    -------
    dict with keys:
        estimated_nil_usd : float
        weighted_avg : float (same as estimated)
        min_comparable : float
        max_comparable : float
        confidence_range : float (max - min of comparables)
        n_comparables : int
    """
    if not comparables:
        return {
            "estimated_nil_usd": 0.0,
            "weighted_avg": 0.0,
            "min_comparable": 0.0,
            "max_comparable": 0.0,
            "confidence_range": 0.0,
            "n_comparables": 0,
        }

    weights = np.array([c["similarity"] for c in comparables])
    values = np.array([c["nil_value_usd"] for c in comparables])

    # Normalize weights to sum to 1
    weight_sum = weights.sum()
    if weight_sum > 0:
        norm_weights = weights / weight_sum
    else:
        norm_weights = np.ones_like(weights) / len(weights)

    weighted_avg = float(np.dot(norm_weights, values))

    return {
        "estimated_nil_usd": weighted_avg,
        "weighted_avg": weighted_avg,
        "min_comparable": float(values.min()),
        "max_comparable": float(values.max()),
        "confidence_range": float(values.max() - values.min()),
        "n_comparables": len(comparables),
    }


def predict_all_comparative(
    checkpoint: str | Path,
    dataset_csv: str | Path,
    k: int = 5,
) -> pd.DataFrame:
    """Produce NIL estimates for every player using the comparative method.

    Labeled players retain their actual NIL values. Unlabeled players get
    an estimate derived from their most similar labeled counterparts.

    Parameters
    ----------
    checkpoint : str or Path
    dataset_csv : str or Path
    k : int
        Number of comparable players to use.

    Returns
    -------
    pd.DataFrame with columns: name, school, position, nil_value_usd (actual
    or None), estimated_nil_usd, estimation_method, top_comparable_1 through
    top_comparable_3, model_pred_usd.
    """
    import yaml

    model, state, cfg = load_checkpoint(checkpoint)

    df = load_dataset_csv(str(dataset_csv))

    # Split into labeled (reference) and unlabeled
    labeled_mask = df["nil_value_usd"].notna()
    ref_df = df[labeled_mask].reset_index(drop=True)
    all_df = df.reset_index(drop=True)

    # Transform reference set
    ref_pos_ids, ref_features = transform_features(ref_df, state)
    ref_nil_values = ref_df["nil_value_usd"].to_numpy(dtype=np.float64)
    ref_names = ref_df["name"].tolist()
    ref_schools = ref_df["school"].tolist()

    # Transform all players
    all_pos_ids, all_features = transform_features(all_df, state)

    # Also get model predictions for blending context
    import torch
    model.eval()
    with torch.no_grad():
        preds_log = model(
            torch.from_numpy(all_pos_ids),
            torch.from_numpy(all_features),
        ).cpu().numpy()
    from data.preprocessing import inverse_transform_target
    model_preds_usd = inverse_transform_target(preds_log, state)

    # Build output
    rows = []
    for i in range(len(all_df)):
        player_row = all_df.iloc[i]
        actual_nil = player_row["nil_value_usd"] if labeled_mask.iloc[i] else None

        if labeled_mask.iloc[i]:
            # Labeled player: use actual value
            rows.append({
                "name": player_row["name"],
                "school": player_row["school"],
                "position": player_row["position"],
                "nil_value_usd": float(actual_nil),
                "estimated_nil_usd": float(actual_nil),
                "estimation_method": "actual",
                "model_pred_usd": float(model_preds_usd[i]),
                "top_comparable_1": "",
                "top_comparable_2": "",
                "top_comparable_3": "",
                "confidence_range": 0.0,
            })
        else:
            # Unlabeled player: find comparables
            comparables = find_comparables(
                player_features=all_features[i],
                player_position_id=int(all_pos_ids[i]),
                ref_features=ref_features,
                ref_position_ids=ref_pos_ids,
                ref_nil_values=ref_nil_values,
                ref_names=ref_names,
                ref_schools=ref_schools,
                k=k,
            )
            estimate = estimate_nil_from_comparables(comparables)

            # Format top 3 comparables as readable strings
            comp_strs = []
            for c in comparables[:3]:
                comp_strs.append(
                    f"{c['name']} ({c['school']}, ${c['nil_value_usd']:,.0f}, "
                    f"sim={c['similarity']:.2f})"
                )
            while len(comp_strs) < 3:
                comp_strs.append("")

            rows.append({
                "name": player_row["name"],
                "school": player_row["school"],
                "position": player_row["position"],
                "nil_value_usd": None,
                "estimated_nil_usd": estimate["estimated_nil_usd"],
                "estimation_method": "comparative",
                "model_pred_usd": float(model_preds_usd[i]),
                "top_comparable_1": comp_strs[0],
                "top_comparable_2": comp_strs[1],
                "top_comparable_3": comp_strs[2],
                "confidence_range": estimate["confidence_range"],
            })

    return pd.DataFrame(rows)


def predict_player_comparative(
    checkpoint: str | Path,
    dataset_csv: str | Path,
    player_name: str,
    school: Optional[str] = None,
    k: int = 5,
) -> list[dict]:
    """Produce a comparative NIL estimate for a single player.

    Parameters
    ----------
    checkpoint : str or Path
    dataset_csv : str or Path
    player_name : str
    school : str, optional
    k : int

    Returns
    -------
    list of dict with estimate and comparable players.
    """
    model, state, cfg = load_checkpoint(checkpoint)
    df = load_dataset_csv(str(dataset_csv))

    # Find target player
    mask = df["name"].str.lower() == player_name.lower().strip()
    if school:
        mask &= df["school"].str.lower() == school.lower().strip()
    target_df = df[mask].reset_index(drop=True)
    if target_df.empty:
        return []

    # Reference set (labeled players)
    ref_mask = df["nil_value_usd"].notna()
    ref_df = df[ref_mask].reset_index(drop=True)
    ref_pos_ids, ref_features = transform_features(ref_df, state)
    ref_nil_values = ref_df["nil_value_usd"].to_numpy(dtype=np.float64)
    ref_names = ref_df["name"].tolist()
    ref_schools = ref_df["school"].tolist()

    # Transform target
    target_pos_ids, target_features = transform_features(target_df, state)

    results = []
    for i in range(len(target_df)):
        comparables = find_comparables(
            player_features=target_features[i],
            player_position_id=int(target_pos_ids[i]),
            ref_features=ref_features,
            ref_position_ids=ref_pos_ids,
            ref_nil_values=ref_nil_values,
            ref_names=ref_names,
            ref_schools=ref_schools,
            k=k,
        )
        estimate = estimate_nil_from_comparables(comparables)
        results.append({
            "name": target_df.iloc[i]["name"],
            "school": target_df.iloc[i]["school"],
            "position": target_df.iloc[i]["position"],
            "estimated_nil_usd": estimate["estimated_nil_usd"],
            "min_comparable": estimate["min_comparable"],
            "max_comparable": estimate["max_comparable"],
            "comparables": comparables,
        })
    return results


def _main() -> None:
    parser = argparse.ArgumentParser(
        description="Comparative NIL estimation using labeled players as reference."
    )
    parser.add_argument("--checkpoint", default="training/checkpoints/best.pt")
    parser.add_argument("--dataset", default="data/sec_2025.csv")
    parser.add_argument("--player", default=None)
    parser.add_argument("--school", default=None)
    parser.add_argument("--k", type=int, default=5, help="Number of comparables.")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--output", default=None)
    args = parser.parse_args()

    if args.all:
        df = predict_all_comparative(args.checkpoint, args.dataset, k=args.k)
        if args.output:
            out_path = Path(args.output)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            df.to_csv(out_path, index=False)
            labeled = df[df["estimation_method"] == "actual"]
            estimated = df[df["estimation_method"] == "comparative"]
            print(
                f"Wrote {len(df)} predictions ({len(labeled)} actual, "
                f"{len(estimated)} comparative) to {out_path}"
            )
        else:
            # Print summary by position
            for pos in ["QB", "WR", "TE", "MLB", "S"]:
                sub = df[df["position"] == pos].sort_values(
                    "estimated_nil_usd", ascending=False
                )
                print(f"\n{'='*60}")
                print(f"  {pos} ({len(sub)} players)")
                print(f"{'='*60}")
                for _, r in sub.head(10).iterrows():
                    method = "ACTUAL" if r["estimation_method"] == "actual" else "est"
                    print(
                        f"  {r['name']:25s} {r['school']:18s} "
                        f"${r['estimated_nil_usd']:>12,.0f}  [{method}]"
                    )
        return

    if not args.player:
        parser.error("--player is required unless --all is given")

    results = predict_player_comparative(
        args.checkpoint, args.dataset, args.player, school=args.school, k=args.k
    )
    if not results:
        print(f"No match for player={args.player!r}")
        return

    for r in results:
        print(f"\n{r['name']} ({r['school']}, {r['position']})")
        print(f"  Estimated NIL: ${r['estimated_nil_usd']:,.0f}")
        print(f"  Range from comparables: ${r['min_comparable']:,.0f} - ${r['max_comparable']:,.0f}")
        print(f"  Comparable players:")
        for c in r["comparables"]:
            print(
                f"    {c['name']:25s} {c['school']:15s} "
                f"${c['nil_value_usd']:>10,.0f}  (similarity: {c['similarity']:.3f})"
            )


if __name__ == "__main__":
    _main()
