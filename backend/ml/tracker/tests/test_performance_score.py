"""Tests for tracker/evaluation/performance_score.py."""

from __future__ import annotations

from tracker.evaluation.baselines import PositionBaseline, StatBaseline
from tracker.evaluation.performance_score import compute_performance_score


def _qb_baseline() -> PositionBaseline:
    return PositionBaseline(
        position="QB",
        stats=[
            StatBaseline("pass_yards", avg=250, weight=0.25),
            StatBaseline("pass_tds", avg=2.0, weight=0.20),
            StatBaseline("ints", avg=0.8, weight=-0.20),
            StatBaseline("completion_pct", avg=62.0, weight=0.15),
        ],
    )


def test_average_game_scores_near_zero():
    stats = {"pass_yards": 250, "pass_tds": 2, "ints": 0.8, "completion_pct": 62.0}
    score = compute_performance_score(stats, _qb_baseline())
    assert abs(score) < 0.01


def test_great_game_scores_positive():
    stats = {"pass_yards": 400, "pass_tds": 4, "ints": 0, "completion_pct": 75.0}
    score = compute_performance_score(stats, _qb_baseline())
    assert score > 0.3


def test_bad_game_scores_negative():
    stats = {"pass_yards": 100, "pass_tds": 0, "ints": 3, "completion_pct": 45.0}
    score = compute_performance_score(stats, _qb_baseline())
    assert score < -0.3


def test_ints_penalize_score():
    good_no_ints = {"pass_yards": 300, "pass_tds": 2, "ints": 0, "completion_pct": 65.0}
    good_with_ints = {"pass_yards": 300, "pass_tds": 2, "ints": 3, "completion_pct": 65.0}
    s1 = compute_performance_score(good_no_ints, _qb_baseline())
    s2 = compute_performance_score(good_with_ints, _qb_baseline())
    assert s1 > s2


def test_opponent_strength_modifier():
    stats = {"pass_yards": 300, "pass_tds": 2, "ints": 1, "completion_pct": 65.0}
    adj_cfg = {
        "opponent_strength": {"enabled": True, "elo_center": 1500, "elo_scale_per_100": 0.05},
        "win_loss": {},
    }
    score_weak_opp = compute_performance_score(stats, _qb_baseline(), opp_elo=1300, adjustment_cfg=adj_cfg)
    score_strong_opp = compute_performance_score(stats, _qb_baseline(), opp_elo=1700, adjustment_cfg=adj_cfg)
    assert score_strong_opp > score_weak_opp


def test_win_bonus():
    stats = {"pass_yards": 250, "pass_tds": 2, "ints": 1, "completion_pct": 62.0}
    adj_cfg = {
        "opponent_strength": {"enabled": False},
        "win_loss": {"win_bonus": 0.03, "loss_penalty": -0.02},
    }
    sw = compute_performance_score(stats, _qb_baseline(), team_result="W", adjustment_cfg=adj_cfg)
    sl = compute_performance_score(stats, _qb_baseline(), team_result="L", adjustment_cfg=adj_cfg)
    assert sw > sl


def test_defensive_baseline():
    lb = PositionBaseline(
        position="LB",
        stats=[
            StatBaseline("total_tackles", avg=7.0, weight=0.25),
            StatBaseline("sacks", avg=0.5, weight=0.20),
        ],
    )
    great = {"total_tackles": 12, "sacks": 2}
    bad = {"total_tackles": 2, "sacks": 0}
    assert compute_performance_score(great, lb) > 0
    assert compute_performance_score(bad, lb) < 0
