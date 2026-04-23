"""Per-position stat baselines loaded from the tracker config.

Each baseline is a dict of stat names to ``{"avg": float, "weight": float}``.
The ``avg`` is the expected value for a starting-caliber SEC player in a
single game. ``weight`` determines how much that stat contributes to the
composite performance score. Negative weights (e.g., interceptions for QBs)
mean that higher values are worse.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class StatBaseline:
    """A single stat's baseline and its contribution weight.

    Attributes
    ----------
    name : str
    avg : float
        Expected value per game.
    weight : float
        Signed weight. Negative means higher values hurt the score.
    """

    name: str
    avg: float
    weight: float


@dataclass
class PositionBaseline:
    """Collection of stat baselines for one position.

    Attributes
    ----------
    position : str
    stats : list of StatBaseline
    """

    position: str
    stats: list[StatBaseline]


def load_baselines(config: dict[str, Any]) -> dict[str, PositionBaseline]:
    """Parse baselines from the loaded tracker_config.yaml.

    Parameters
    ----------
    config : dict
        The full config dict. Reads ``config["baselines"]``.

    Returns
    -------
    dict mapping position string to PositionBaseline.
    """
    raw = config.get("baselines", {})
    out: dict[str, PositionBaseline] = {}
    for pos, pos_cfg in raw.items():
        stats = []
        for stat_name, stat_cfg in pos_cfg.get("stats", {}).items():
            stats.append(
                StatBaseline(
                    name=stat_name,
                    avg=float(stat_cfg.get("avg", 0)),
                    weight=float(stat_cfg.get("weight", 0)),
                )
            )
        out[pos.upper()] = PositionBaseline(position=pos.upper(), stats=stats)
    return out
