"""XGBoost baseline for comparison against the PyTorch embedding model.

The baseline one-hot encodes the position instead of learning an embedding.
Everything else (features, target transform, evaluation splits) matches the
main model so the comparison is apples-to-apples.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np


@dataclass
class XGBoostBaselineConfig:
    """Hyperparameters for the XGBoost baseline.

    Attributes
    ----------
    n_estimators : int
    max_depth : int
    learning_rate : float
    subsample : float
    colsample_bytree : float
    random_state : int
    """

    n_estimators: int = 400
    max_depth: int = 4
    learning_rate: float = 0.05
    subsample: float = 0.85
    colsample_bytree: float = 0.85
    random_state: int = 42


def one_hot_positions(position_ids: np.ndarray, num_positions: int) -> np.ndarray:
    """One-hot encode integer position ids.

    Parameters
    ----------
    position_ids : np.ndarray of int
    num_positions : int

    Returns
    -------
    np.ndarray of float32, shape (N, num_positions)
    """
    out = np.zeros((position_ids.shape[0], num_positions), dtype=np.float32)
    out[np.arange(position_ids.shape[0]), position_ids] = 1.0
    return out


def build_xgboost_features(
    position_ids: np.ndarray,
    numeric: np.ndarray,
    num_positions: int,
) -> np.ndarray:
    """Concatenate one-hot positions with numerical features.

    Parameters
    ----------
    position_ids : np.ndarray of int
    numeric : np.ndarray of float
    num_positions : int

    Returns
    -------
    np.ndarray of float32, shape (N, num_positions + numeric.shape[1])
    """
    one_hot = one_hot_positions(position_ids, num_positions)
    return np.concatenate([one_hot, numeric.astype(np.float32)], axis=1).astype(np.float32)


def train_xgboost(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_val: np.ndarray,
    y_val: np.ndarray,
    config: XGBoostBaselineConfig,
) -> Any:
    """Train an XGBoost regressor with early stopping.

    Parameters
    ----------
    X_train, X_val : np.ndarray
    y_train, y_val : np.ndarray
        Log-transformed targets. Inverse the log externally for reporting.
    config : XGBoostBaselineConfig

    Returns
    -------
    xgboost.XGBRegressor
        Fitted model.
    """
    import xgboost as xgb

    model = xgb.XGBRegressor(
        n_estimators=config.n_estimators,
        max_depth=config.max_depth,
        learning_rate=config.learning_rate,
        subsample=config.subsample,
        colsample_bytree=config.colsample_bytree,
        random_state=config.random_state,
        objective="reg:pseudohubererror",
        tree_method="hist",
        early_stopping_rounds=30,
    )
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    return model
