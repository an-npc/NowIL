"""Tests for tracker/evaluation/nil_adjuster.py."""

from __future__ import annotations

from tracker.evaluation.nil_adjuster import compute_nil_delta, create_state


def _default_cfg() -> dict:
    return {
        "base_multiplier": 0.05,
        "max_pct_change_per_game": 0.08,
        "floor_pct": 0.30,
        "momentum": {"streak_bonus": 0.10, "max_streak": 5},
        "recency": {"recency_slope": 0.30},
        "decay": {"enabled": False},
    }


def test_positive_score_increases_nil():
    state = create_state(1_000_000)
    delta = compute_nil_delta(state, 0.5, week=5, total_weeks=15, cfg=_default_cfg())
    assert delta > 0
    assert state.current_nil > 1_000_000


def test_negative_score_decreases_nil():
    state = create_state(1_000_000)
    delta = compute_nil_delta(state, -0.5, week=5, total_weeks=15, cfg=_default_cfg())
    assert delta < 0
    assert state.current_nil < 1_000_000


def test_floor_enforced():
    state = create_state(1_000_000)
    cfg = _default_cfg()
    cfg["floor_pct"] = 0.30
    # Apply many bad games
    for i in range(1, 30):
        compute_nil_delta(state, -1.0, week=i, total_weeks=30, cfg=cfg)
    assert state.current_nil >= 300_000


def test_max_change_capped():
    state = create_state(1_000_000)
    cfg = _default_cfg()
    cfg["max_pct_change_per_game"] = 0.08
    delta = compute_nil_delta(state, 5.0, week=1, total_weeks=15, cfg=cfg)
    assert abs(delta) <= 1_000_000 * 0.08 + 1  # +1 for rounding


def test_momentum_compounds():
    state_streak = create_state(1_000_000)
    state_single = create_state(1_000_000)
    cfg = _default_cfg()

    # 3-game streak
    for i in range(1, 4):
        compute_nil_delta(state_streak, 0.3, week=i, total_weeks=15, cfg=cfg)

    # 3 isolated games (reset streak each time)
    for i in range(1, 4):
        s = create_state(1_000_000)
        compute_nil_delta(s, 0.3, week=i, total_weeks=15, cfg=cfg)
        state_single.current_nil += s.current_nil - 1_000_000

    # Streak should produce more total gain than isolated
    assert state_streak.current_nil > state_single.current_nil


def test_recency_boosts_later_weeks():
    cfg = _default_cfg()
    state_early = create_state(1_000_000)
    state_late = create_state(1_000_000)
    d_early = compute_nil_delta(state_early, 0.5, week=1, total_weeks=15, cfg=cfg)
    d_late = compute_nil_delta(state_late, 0.5, week=14, total_weeks=15, cfg=cfg)
    assert abs(d_late) > abs(d_early)


def test_streak_resets_on_direction_change():
    state = create_state(1_000_000)
    cfg = _default_cfg()
    compute_nil_delta(state, 0.5, week=1, total_weeks=15, cfg=cfg)
    compute_nil_delta(state, 0.5, week=2, total_weeks=15, cfg=cfg)
    assert state.streak == 2
    compute_nil_delta(state, -0.3, week=3, total_weeks=15, cfg=cfg)
    assert state.streak == -1
