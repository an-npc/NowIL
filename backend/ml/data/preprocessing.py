"""Feature engineering for the SEC NIL model.

Responsibilities
----------------
- Encode the position as an integer id consistent with the config ordering.
- Build the fixed-order numeric stat vector from the union of per-position
  stat fields.
- Impute missing context features (revenue, followers) using the training
  median, fit on the train fold only to avoid leakage.
- Normalize numerical features with a per-feature standard scaler, again fit
  on the training fold.
- Log-transform the NIL target.

The output is a set of torch-ready arrays plus a serializable
``PreprocessState`` that records exactly which medians and scaler stats were
used, so inference can reproduce the transform.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Iterable, Optional

import numpy as np
import pandas as pd


@dataclass
class PreprocessState:
    """Serializable state captured when fitting the preprocessor on a fold.

    Attributes
    ----------
    position_order : list of str
        Canonical position order (position_id is the index into this list).
    stat_feature_order : list of str
        Order of the stat feature vector.
    context_feature_order : list of str
        Order of the context feature vector.
    feature_mean : np.ndarray
        Mean of each numerical feature on the training fold.
    feature_std : np.ndarray
        Standard deviation of each numerical feature on the training fold.
        Zero stds are replaced with 1.0 before normalization.
    revenue_median : float
        Median school athletic revenue on the training fold, used to impute
        missing values.
    followers_median : float
        Median social follower count on the training fold.
    target_log : bool
        Whether the target was log1p-transformed.
    """

    position_order: list[str]
    stat_feature_order: list[str]
    context_feature_order: list[str]
    feature_mean: np.ndarray = field(default_factory=lambda: np.zeros(0))
    feature_std: np.ndarray = field(default_factory=lambda: np.ones(0))
    revenue_median: float = 0.0
    followers_median: float = 0.0
    target_log: bool = True

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-serializable dict of the fitted state."""
        return {
            "position_order": list(self.position_order),
            "stat_feature_order": list(self.stat_feature_order),
            "context_feature_order": list(self.context_feature_order),
            "feature_mean": self.feature_mean.tolist(),
            "feature_std": self.feature_std.tolist(),
            "revenue_median": float(self.revenue_median),
            "followers_median": float(self.followers_median),
            "target_log": bool(self.target_log),
        }

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "PreprocessState":
        """Rehydrate from ``to_dict`` output."""
        return cls(
            position_order=list(payload["position_order"]),
            stat_feature_order=list(payload["stat_feature_order"]),
            context_feature_order=list(payload["context_feature_order"]),
            feature_mean=np.array(payload["feature_mean"], dtype=np.float32),
            feature_std=np.array(payload["feature_std"], dtype=np.float32),
            revenue_median=float(payload["revenue_median"]),
            followers_median=float(payload["followers_median"]),
            target_log=bool(payload.get("target_log", True)),
        )


def encode_positions(
    positions: Iterable[str],
    position_order: list[str],
) -> np.ndarray:
    """Map position strings to integer ids.

    Parameters
    ----------
    positions : iterable of str
    position_order : list of str
        Canonical ordering; index is the id.

    Returns
    -------
    np.ndarray of int64
    """
    idx = {p: i for i, p in enumerate(position_order)}
    materialized = list(positions)
    out = np.empty(len(materialized), dtype=np.int64)
    for i, p in enumerate(materialized):
        if p not in idx:
            raise ValueError(f"Unknown position: {p!r}. Expected one of {position_order}")
        out[i] = idx[p]
    return out


def fit_preprocessor(
    df: pd.DataFrame,
    position_order: list[str],
    stat_feature_order: list[str],
    context_feature_order: list[str],
    target_log: bool = True,
) -> PreprocessState:
    """Fit the preprocessor on a training DataFrame.

    Parameters
    ----------
    df : pd.DataFrame
        Must contain every column in ``stat_feature_order`` and
        ``context_feature_order``. Missing values in revenue and followers are
        permitted and are used to compute the imputation median.
    position_order : list of str
    stat_feature_order : list of str
    context_feature_order : list of str
    target_log : bool

    Returns
    -------
    PreprocessState
    """
    revenue_col = "school_athletic_revenue_usd"
    followers_col = "social_followers_total"

    revenue_median = (
        float(df[revenue_col].median()) if revenue_col in df.columns else 0.0
    )
    if np.isnan(revenue_median):
        revenue_median = 0.0
    followers_median = (
        float(df[followers_col].median()) if followers_col in df.columns else 0.0
    )
    if np.isnan(followers_median):
        followers_median = 0.0

    imputed = df.copy()
    if revenue_col in imputed.columns:
        imputed[revenue_col] = imputed[revenue_col].fillna(revenue_median)
    if followers_col in imputed.columns:
        imputed[followers_col] = imputed[followers_col].fillna(followers_median)

    feature_cols = [*stat_feature_order, *context_feature_order]
    matrix = imputed[feature_cols].to_numpy(dtype=np.float32, copy=True)
    mean = matrix.mean(axis=0)
    std = matrix.std(axis=0)
    std = np.where(std < 1e-8, 1.0, std).astype(np.float32)

    return PreprocessState(
        position_order=position_order,
        stat_feature_order=stat_feature_order,
        context_feature_order=context_feature_order,
        feature_mean=mean.astype(np.float32),
        feature_std=std,
        revenue_median=revenue_median,
        followers_median=followers_median,
        target_log=target_log,
    )


def transform_features(
    df: pd.DataFrame,
    state: PreprocessState,
) -> tuple[np.ndarray, np.ndarray]:
    """Apply a fitted preprocessor to a DataFrame.

    Parameters
    ----------
    df : pd.DataFrame
        Must contain the same feature columns used to fit the state, plus
        a ``position`` column.
    state : PreprocessState

    Returns
    -------
    (positions, features) : (np.ndarray of int64, np.ndarray of float32)
        ``positions`` shape ``(N,)``. ``features`` shape ``(N, F)`` where F is
        ``len(stat_feature_order) + len(context_feature_order)``.
    """
    revenue_col = "school_athletic_revenue_usd"
    followers_col = "social_followers_total"

    imputed = df.copy()
    if revenue_col in imputed.columns:
        imputed[revenue_col] = imputed[revenue_col].fillna(state.revenue_median)
    if followers_col in imputed.columns:
        imputed[followers_col] = imputed[followers_col].fillna(state.followers_median)

    feature_cols = [*state.stat_feature_order, *state.context_feature_order]
    for col in feature_cols:
        if col not in imputed.columns:
            imputed[col] = 0.0
    matrix = imputed[feature_cols].to_numpy(dtype=np.float32, copy=True)
    matrix = (matrix - state.feature_mean) / state.feature_std

    positions = encode_positions(imputed["position"].tolist(), state.position_order)
    return positions, matrix.astype(np.float32)


def transform_target(
    y: np.ndarray,
    state: PreprocessState,
) -> np.ndarray:
    """Apply the forward target transform.

    Parameters
    ----------
    y : np.ndarray
        Raw NIL values in USD.
    state : PreprocessState

    Returns
    -------
    np.ndarray of float32
    """
    if state.target_log:
        return np.log1p(y.astype(np.float64)).astype(np.float32)
    return y.astype(np.float32)


def inverse_transform_target(
    y: np.ndarray,
    state: PreprocessState,
) -> np.ndarray:
    """Invert the target transform (log-space back to USD)."""
    if state.target_log:
        return np.expm1(y.astype(np.float64)).astype(np.float32)
    return y.astype(np.float32)


def filter_trainable(df: pd.DataFrame, target_col: str = "nil_value_usd") -> pd.DataFrame:
    """Return only rows that have a non-null, non-negative target.

    Parameters
    ----------
    df : pd.DataFrame
    target_col : str

    Returns
    -------
    pd.DataFrame
    """
    mask = df[target_col].notna() & (df[target_col].astype(float) >= 0)
    return df.loc[mask].reset_index(drop=True)


def load_dataset_csv(path: str) -> pd.DataFrame:
    """Load the dataset CSV produced by ``build_dataset.py``.

    Blank cells are parsed as NaN for numerical columns. Class year ordinal
    is coerced to int with 0 for unknown.
    """
    df = pd.read_csv(path)
    if "class_year_ordinal" in df.columns:
        df["class_year_ordinal"] = (
            pd.to_numeric(df["class_year_ordinal"], errors="coerce").fillna(0).astype(int)
        )
    return df


def stratified_kfold_indices(
    positions: np.ndarray,
    k: int,
    seed: int,
) -> list[tuple[np.ndarray, np.ndarray]]:
    """Produce per-position-stratified k-fold indices.

    Parameters
    ----------
    positions : np.ndarray of int64
        Position ids, shape ``(N,)``.
    k : int
        Number of folds.
    seed : int

    Returns
    -------
    list of (train_idx, val_idx) tuples
    """
    from sklearn.model_selection import StratifiedKFold

    skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=seed)
    X_dummy = np.zeros((len(positions), 1), dtype=np.float32)
    return [(train, val) for train, val in skf.split(X_dummy, positions)]
