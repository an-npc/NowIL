"""Compute NIL deltas from performance scores with momentum, recency, and decay.

The adjuster is stateful: it tracks the running NIL value, streak length, and
prior scores across the season to apply compounding and decay effects.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class AdjusterState:
    """Mutable state carried across games for one player.

    Attributes
    ----------
    initial_nil : int
        Starting NIL at week 0.
    current_nil : float
        Running NIL after the most recent game.
    streak : int
        Positive for consecutive positive-score games, negative for
        consecutive negative-score games, zero at start.
    scores : list of float
        All performance scores so far this season.
    nil_history : list of float
        NIL value after each game.
    """

    initial_nil: int
    current_nil: float
    streak: int = 0
    scores: list[float] = field(default_factory=list)
    nil_history: list[float] = field(default_factory=list)


def create_state(initial_nil: int) -> AdjusterState:
    """Initialize adjuster state for a player.

    Parameters
    ----------
    initial_nil : int

    Returns
    -------
    AdjusterState
    """
    return AdjusterState(initial_nil=initial_nil, current_nil=float(initial_nil))


def compute_nil_delta(
    state: AdjusterState,
    performance_score: float,
    week: int,
    total_weeks: int,
    cfg: dict[str, Any],
) -> float:
    """Compute the NIL dollar change for one game and update state.

    Parameters
    ----------
    state : AdjusterState
        Modified in place: streak, scores, nil_history, current_nil are
        updated.
    performance_score : float
    week : int
        1-indexed week number.
    total_weeks : int
        Total weeks in the season (for recency scaling).
    cfg : dict
        The ``config["adjustment"]`` sub-dict.

    Returns
    -------
    float
        Dollar delta (positive or negative).
    """
    base_mult = float(cfg.get("base_multiplier", 0.05))
    max_pct = float(cfg.get("max_pct_change_per_game", 0.08))
    floor_pct = float(cfg.get("floor_pct", 0.30))

    # --- Base delta ---
    delta = state.current_nil * base_mult * performance_score

    # --- Momentum ---
    mom_cfg = cfg.get("momentum", {})
    streak_bonus = float(mom_cfg.get("streak_bonus", 0.10))
    max_streak = int(mom_cfg.get("max_streak", 5))

    # Update streak
    if performance_score > 0:
        state.streak = max(state.streak, 0) + 1
    elif performance_score < 0:
        state.streak = min(state.streak, 0) - 1
    else:
        state.streak = 0

    streak_len = min(abs(state.streak), max_streak)
    if streak_len > 1:
        momentum_mult = 1.0 + streak_bonus * (streak_len - 1)
        delta *= momentum_mult

    # --- Recency ---
    rec_cfg = cfg.get("recency", {})
    rec_slope = float(rec_cfg.get("recency_slope", 0.30))
    if total_weeks > 0:
        recency_mult = 1.0 + rec_slope * (week / total_weeks)
        delta *= recency_mult

    # --- Decay toward running average ---
    decay_cfg = cfg.get("decay", {})
    if decay_cfg.get("enabled", False) and len(state.nil_history) >= 2:
        decay_rate = float(decay_cfg.get("decay_rate", 0.10))
        running_avg = sum(state.nil_history) / len(state.nil_history)
        deviation_from_avg = state.current_nil - running_avg
        # Pull back toward the average
        decay_pull = -deviation_from_avg * decay_rate
        delta += decay_pull

    # --- Cap the delta ---
    max_change = state.current_nil * max_pct
    delta = max(-max_change, min(max_change, delta))

    # --- Apply and enforce floor ---
    new_nil = state.current_nil + delta
    floor = state.initial_nil * floor_pct
    if new_nil < floor:
        new_nil = floor
        delta = new_nil - state.current_nil

    # --- Update state ---
    state.scores.append(performance_score)
    state.current_nil = new_nil
    state.nil_history.append(new_nil)

    return delta
