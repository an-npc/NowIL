"""Compute a per-game performance score for a player.

The score represents how far above or below position-specific expectations
the player performed, as a float roughly in [-1.0, +1.0] (can exceed bounds
for truly extreme games).

Scoring logic
-------------
For each stat tracked for the position:
    deviation = (actual - baseline_avg) / max(baseline_avg, 1)
    contribution = deviation * weight

The raw composite is the sum of all contributions. It is then optionally
adjusted for opponent strength and win/loss outcome.
"""

from __future__ import annotations

from typing import Any

from tracker.evaluation.baselines import PositionBaseline


def compute_performance_score(
    game_stats: dict[str, Any],
    baseline: PositionBaseline,
    opp_elo: float = 1500,
    team_result: str = "",
    adjustment_cfg: dict[str, Any] | None = None,
) -> float:
    """Compute the performance score for one game.

    Parameters
    ----------
    game_stats : dict
        Flat stat dict for the player in this game (e.g., pass_yards=312).
    baseline : PositionBaseline
        Position-specific expected values and weights.
    opp_elo : float, default 1500
        Opponent pregame Elo rating.
    team_result : str
        ``"W"``, ``"L"``, or ``"T"``.
    adjustment_cfg : dict, optional
        The ``config["adjustment"]`` sub-dict. When None, opponent strength
        and win/loss modifiers are skipped.

    Returns
    -------
    float
        Composite performance score. Positive is above baseline, negative
        is below.
    """
    raw_score = 0.0

    for stat in baseline.stats:
        actual = float(game_stats.get(stat.name, 0.0))
        avg = stat.avg if abs(stat.avg) > 1e-9 else 1.0
        deviation = (actual - stat.avg) / abs(avg)

        if stat.weight < 0:
            # Negative-weight stat (e.g. INTs): more is worse.
            # deviation is positive when actual > avg, meaning worse.
            # weight is negative, so contribution is negative (bad). Correct.
            pass

        raw_score += deviation * stat.weight

    # Clamp raw score to [-2, 2] to prevent single-stat blowouts
    raw_score = max(-2.0, min(2.0, raw_score))

    if adjustment_cfg is None:
        return raw_score

    # Opponent strength modifier
    opp_cfg = adjustment_cfg.get("opponent_strength", {})
    if opp_cfg.get("enabled", False):
        elo_center = float(opp_cfg.get("elo_center", 1500))
        scale = float(opp_cfg.get("elo_scale_per_100", 0.05))
        elo_bonus = (opp_elo - elo_center) / 100.0 * scale
        raw_score += elo_bonus

    # Win/loss modifier
    wl_cfg = adjustment_cfg.get("win_loss", {})
    if team_result == "W":
        raw_score += float(wl_cfg.get("win_bonus", 0.0))
    elif team_result == "L":
        raw_score += float(wl_cfg.get("loss_penalty", 0.0))

    return raw_score
