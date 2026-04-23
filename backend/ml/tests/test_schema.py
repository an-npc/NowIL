"""Tests for data/schema.py."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from data.schema import CLASS_YEAR_ORDINAL, NILRecord, Player, SeasonStats


def _sample_player() -> Player:
    return Player(
        player_id="cfbd-12345",
        name="Test Player",
        school="Alabama",
        position="QB",
        class_year="JR",
        jersey=12,
    )


def _sample_stats() -> SeasonStats:
    return SeasonStats(
        player_id="cfbd-12345",
        season=2025,
        games_played=12,
        pass_attempts=350.0,
        pass_completions=230.0,
        pass_yards=2800.0,
        pass_tds=24.0,
    )


def test_player_accepts_valid_position():
    player = _sample_player()
    assert player.position == "QB"


def test_player_rejects_unknown_position():
    with pytest.raises(ValidationError):
        Player(
            player_id="x",
            name="x",
            school="Alabama",
            position="K",  # not in the supported set
        )


def test_player_rejects_extra_fields():
    with pytest.raises(ValidationError):
        Player(
            player_id="x",
            name="x",
            school="Alabama",
            position="QB",
            twitter_handle="@x",  # extra, should fail
        )


def test_seasonstats_defaults_to_zero():
    s = SeasonStats(player_id="x", season=2025)
    assert s.pass_attempts == 0.0
    assert s.total_tackles == 0.0
    assert s.games_played == 0


def test_seasonstats_rejects_negative_games():
    with pytest.raises(ValidationError):
        SeasonStats(player_id="x", season=2025, games_played=-1)


def test_nilrecord_marks_trainable_when_label_present():
    rec = NILRecord(
        player=_sample_player(),
        stats=_sample_stats(),
        team_win_pct=0.9,
        team_strength_of_schedule=0.7,
        school_athletic_revenue_usd=200_000_000.0,
        social_followers_total=250_000.0,
        nil_value_usd=1_500_000.0,
    )
    assert rec.is_trainable() is True


def test_nilrecord_marks_inference_only_when_label_missing():
    rec = NILRecord(
        player=_sample_player(),
        stats=_sample_stats(),
        team_win_pct=0.5,
        nil_value_usd=None,
    )
    assert rec.is_trainable() is False


def test_nilrecord_rejects_negative_nil():
    with pytest.raises(ValidationError):
        NILRecord(
            player=_sample_player(),
            stats=_sample_stats(),
            team_win_pct=0.5,
            nil_value_usd=-1.0,
        )


def test_nilrecord_rejects_win_pct_out_of_range():
    with pytest.raises(ValidationError):
        NILRecord(
            player=_sample_player(),
            stats=_sample_stats(),
            team_win_pct=1.5,
        )


def test_class_year_ordinal_table_is_complete():
    assert CLASS_YEAR_ORDINAL == {"FR": 1, "SO": 2, "JR": 3, "SR": 4, "GR": 5}
