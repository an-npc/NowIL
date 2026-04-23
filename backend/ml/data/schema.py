"""Pydantic schemas for all records that flow through the pipeline.

The four core record types are:

- Player: identity, school, and position for a single athlete-season.
- SeasonStats: aggregated season statistics for one player-season.
- GameStats: single-game statistics, used by the real-time LSTM head.
- NILRecord: a labeled example joining Player, SeasonStats, and NIL valuation.

Models use pydantic v2. Unknown fields are rejected so the ingest layer catches
schema drift from CFBD early.
"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

Position = Literal["QB", "WR", "TE", "MLB", "S"]
ClassYear = Literal["FR", "SO", "JR", "SR", "GR"]

CLASS_YEAR_ORDINAL: dict[str, int] = {
    "FR": 1,
    "SO": 2,
    "JR": 3,
    "SR": 4,
    "GR": 5,
}


class Player(BaseModel):
    """Identity of a single athlete-season.

    Parameters
    ----------
    player_id : str
        Stable unique identifier. For CFBD-sourced rows this is the CFBD player
        id rendered as a string. For manually entered rows, use a slug of the
        form ``"school-lastname-firstname"``.
    name : str
        Full display name as listed on the official school roster.
    school : str
        SEC school the player was rostered with during the season.
    position : Position
        One of QB, WR, TE, MLB, S.
    class_year : ClassYear or None
        Eligibility year at the time of the season. None when unknown.
    jersey : int or None
        Jersey number, when available.
    """

    model_config = ConfigDict(extra="forbid")

    player_id: str
    name: str
    school: str
    position: Position
    class_year: Optional[ClassYear] = None
    jersey: Optional[int] = None


class SeasonStats(BaseModel):
    """Aggregated season statistics for one player-season.

    All stat fields default to 0.0 so that missing fields for irrelevant
    positions can be zero-filled without branching in the model. The preprocess
    step will re-check that position-irrelevant fields are zero.
    """

    model_config = ConfigDict(extra="forbid")

    player_id: str
    season: int
    games_played: int = 0

    # Passing
    pass_attempts: float = 0.0
    pass_completions: float = 0.0
    pass_yards: float = 0.0
    pass_tds: float = 0.0
    pass_ints_thrown: float = 0.0
    pass_completion_pct: float = 0.0
    qbr: float = 0.0

    # Rushing
    rush_attempts: float = 0.0
    rush_yards: float = 0.0
    rush_tds: float = 0.0

    # Receiving
    receptions: float = 0.0
    targets: float = 0.0
    receiving_yards: float = 0.0
    receiving_tds: float = 0.0
    yards_per_reception: float = 0.0
    longest_reception: float = 0.0
    blocking_snaps: float = 0.0

    # Defense
    total_tackles: float = 0.0
    solo_tackles: float = 0.0
    tfl: float = 0.0
    sacks: float = 0.0
    qb_hurries: float = 0.0
    def_ints: float = 0.0
    pass_breakups: float = 0.0
    forced_fumbles: float = 0.0
    fumble_recoveries: float = 0.0
    defensive_tds: float = 0.0

    @field_validator("games_played")
    @classmethod
    def _games_non_negative(cls, value: int) -> int:
        if value < 0:
            raise ValueError("games_played must be non-negative")
        return value


class GameStats(BaseModel):
    """Per-game statistics used by the LSTM real-time head.

    One row per player per game. The LSTM consumes the most recent
    ``sequence_length`` rows in chronological order.
    """

    model_config = ConfigDict(extra="forbid")

    player_id: str
    season: int
    week: int
    opponent: str
    home: bool

    pass_attempts: float = 0.0
    pass_completions: float = 0.0
    pass_yards: float = 0.0
    pass_tds: float = 0.0
    pass_ints_thrown: float = 0.0
    rush_attempts: float = 0.0
    rush_yards: float = 0.0
    rush_tds: float = 0.0
    receptions: float = 0.0
    targets: float = 0.0
    receiving_yards: float = 0.0
    receiving_tds: float = 0.0
    total_tackles: float = 0.0
    solo_tackles: float = 0.0
    tfl: float = 0.0
    sacks: float = 0.0
    def_ints: float = 0.0
    pass_breakups: float = 0.0
    forced_fumbles: float = 0.0


class NILRecord(BaseModel):
    """A labeled training example.

    Attributes
    ----------
    player : Player
    stats : SeasonStats
    team_win_pct : float
        Team win percentage over the season, in [0.0, 1.0].
    team_strength_of_schedule : float
        Normalized SoS metric; higher is stronger. Scale depends on source.
    school_athletic_revenue_usd : float or None
        Total athletic department revenue for the school in USD. None when
        the Knight-Newhouse row is missing.
    social_followers_total : float or None
        Sum of Instagram and X follower counts. None when not found.
    nil_value_usd : float or None
        Public NIL valuation in USD. None marks the example as inference-only;
        training must filter these out.
    """

    model_config = ConfigDict(extra="forbid")

    player: Player
    stats: SeasonStats
    team_win_pct: float = Field(ge=0.0, le=1.0)
    team_strength_of_schedule: float = 0.0
    school_athletic_revenue_usd: Optional[float] = None
    social_followers_total: Optional[float] = None
    nil_value_usd: Optional[float] = None

    @field_validator("nil_value_usd")
    @classmethod
    def _nil_non_negative(cls, value: Optional[float]) -> Optional[float]:
        if value is not None and value < 0:
            raise ValueError("nil_value_usd must be non-negative")
        return value

    def is_trainable(self) -> bool:
        """Return True when this record has a non-null NIL label."""
        return self.nil_value_usd is not None
