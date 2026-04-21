"""Tests for data/preprocessing.py."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from data.preprocessing import (
    PreprocessState,
    encode_positions,
    filter_trainable,
    fit_preprocessor,
    inverse_transform_target,
    stratified_kfold_indices,
    transform_features,
    transform_target,
)


def _toy_df() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "position": ["QB", "QB", "WR", "WR", "TE"],
            "pass_yards": [2500.0, 3000.0, 0.0, 0.0, 0.0],
            "receiving_yards": [0.0, 0.0, 900.0, 1100.0, 700.0],
            "school_athletic_revenue_usd": [200e6, np.nan, 180e6, 150e6, 160e6],
            "social_followers_total": [np.nan, 250_000.0, 120_000.0, 90_000.0, 50_000.0],
            "team_win_pct": [0.8, 0.9, 0.6, 0.5, 0.7],
            "games_played": [12, 13, 12, 12, 12],
            "nil_value_usd": [1_500_000.0, 2_000_000.0, 900_000.0, np.nan, 400_000.0],
        }
    )


POSITION_ORDER = ["QB", "WR", "TE", "MLB", "S"]
STAT_ORDER = ["pass_yards", "receiving_yards"]
CONTEXT_ORDER = ["team_win_pct", "games_played", "school_athletic_revenue_usd", "social_followers_total"]


def test_encode_positions_maps_by_index():
    arr = encode_positions(["QB", "S", "TE"], POSITION_ORDER)
    assert list(arr) == [0, 4, 2]


def test_encode_positions_rejects_unknown():
    with pytest.raises(ValueError):
        encode_positions(["K"], POSITION_ORDER)


def test_fit_preprocessor_imputes_and_standardizes():
    df = _toy_df()
    state = fit_preprocessor(df, POSITION_ORDER, STAT_ORDER, CONTEXT_ORDER)
    assert state.revenue_median == pytest.approx(170_000_000.0)
    assert state.followers_median == pytest.approx(105_000.0)
    assert state.feature_mean.shape == (len(STAT_ORDER) + len(CONTEXT_ORDER),)
    assert state.feature_std.shape == state.feature_mean.shape
    assert np.all(state.feature_std > 0)


def test_transform_features_applies_fitted_state():
    df = _toy_df()
    state = fit_preprocessor(df, POSITION_ORDER, STAT_ORDER, CONTEXT_ORDER)
    positions, X = transform_features(df, state)
    assert positions.tolist() == [0, 0, 1, 1, 2]
    assert X.shape == (5, len(STAT_ORDER) + len(CONTEXT_ORDER))
    # Mean after transform should be near zero on the training set.
    assert np.allclose(X.mean(axis=0), 0.0, atol=1e-5)
    # Std should be near 1 on the training set.
    assert np.allclose(X.std(axis=0), 1.0, atol=1e-5)


def test_transform_target_roundtrips():
    state = PreprocessState(
        position_order=POSITION_ORDER,
        stat_feature_order=STAT_ORDER,
        context_feature_order=CONTEXT_ORDER,
        target_log=True,
    )
    raw = np.array([0.0, 1_000_000.0, 500_000.0], dtype=np.float32)
    forward = transform_target(raw, state)
    back = inverse_transform_target(forward, state)
    assert np.allclose(back, raw, rtol=1e-3)


def test_filter_trainable_drops_nan_labels():
    df = _toy_df()
    out = filter_trainable(df)
    assert len(out) == 4
    assert out["nil_value_usd"].notna().all()


def test_stratified_kfold_indices_covers_every_example():
    # StratifiedKFold requires n_splits <= min class count.
    positions = np.array([0] * 5 + [1] * 5 + [2] * 5 + [3] * 5 + [4] * 5, dtype=np.int64)
    folds = stratified_kfold_indices(positions, k=5, seed=42)
    assert len(folds) == 5
    covered: set[int] = set()
    for _, val in folds:
        covered.update(int(i) for i in val)
    assert covered == set(range(len(positions)))


def test_preprocess_state_roundtrip():
    state = PreprocessState(
        position_order=POSITION_ORDER,
        stat_feature_order=STAT_ORDER,
        context_feature_order=CONTEXT_ORDER,
        feature_mean=np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], dtype=np.float32),
        feature_std=np.array([0.5, 0.5, 0.5, 0.5, 0.5, 0.5], dtype=np.float32),
        revenue_median=1.0,
        followers_median=2.0,
    )
    recreated = PreprocessState.from_dict(state.to_dict())
    assert recreated.position_order == state.position_order
    assert np.allclose(recreated.feature_mean, state.feature_mean)
    assert recreated.revenue_median == state.revenue_median
