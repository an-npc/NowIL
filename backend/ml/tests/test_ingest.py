"""Tests for ingest modules. Uses mocked API responses and temp files only."""

from __future__ import annotations

from pathlib import Path

import pytest

from data.ingest.cfbd_client import CFBDConfig, fetch_roster, fetch_season_stats, _normalize_position, _normalize_class_year
from data.ingest.knight_newhouse import load_school_revenue
from data.ingest.on3_scraper import (
    NILLabel,
    index_by_name_school,
    load_manual_csv,
    scrape_on3_rankings,
)
from data.ingest.social_media import load_follower_counts
from data.schema import Player


# --- CFBD mocks -----------------------------------------------------------


def _fake_roster_api(team: str, year: int) -> list[dict]:
    data: dict[str, list[dict]] = {
        "Alabama": [
            {"id": 1, "first_name": "QB", "last_name": "Guy", "position": "QB", "year": "SO", "jersey": 2},
            {"id": 2, "first_name": "K", "last_name": "Guy", "position": "K", "year": "SR", "jersey": 15},
        ],
        "Georgia": [
            {"id": 3, "first_name": "LB", "last_name": "Guy", "position": "ILB", "year": 3, "jersey": 42},
        ],
    }
    return data.get(team, [])


def _fake_stats_api(year: int, conference: str) -> list[dict]:
    return [
        {"playerId": 1, "player": "QB Guy", "category": "passing", "statType": "ATT", "stat": 300},
        {"playerId": 1, "player": "QB Guy", "category": "passing", "statType": "YDS", "stat": 2500},
        {"playerId": 1, "player": "QB Guy", "category": "passing", "statType": "TD", "stat": 22},
        {"playerId": 99, "player": "Other", "category": "passing", "statType": "ATT", "stat": 10},
        {"playerId": 1, "player": "QB Guy", "category": "unrecognized", "statType": "X", "stat": 5},
    ]


def test_fetch_roster_filters_to_target_positions():
    players = fetch_roster(
        CFBDConfig(api_key="test", season=2025),
        positions=["QB", "MLB"],
        sec_teams=["Alabama", "Georgia"],
        _api_func=_fake_roster_api,
    )
    names = sorted((p.name, p.position, p.school) for p in players)
    assert names == [
        ("LB Guy", "MLB", "Georgia"),
        ("QB Guy", "QB", "Alabama"),
    ]
    by_name = {p.name: p for p in players}
    assert by_name["QB Guy"].class_year == "SO"
    assert by_name["LB Guy"].class_year == "JR"


def test_fetch_season_stats_pivots_long_rows():
    players = [Player(player_id="1", name="QB Guy", school="Alabama", position="QB")]
    stats = fetch_season_stats(
        CFBDConfig(api_key="test", season=2025),
        players=players,
        _api_func=_fake_stats_api,
    )
    assert len(stats) == 1
    s = stats[0]
    assert s.player_id == "1"
    assert s.pass_attempts == 300.0
    assert s.pass_yards == 2500.0
    assert s.pass_tds == 22.0


# --- On3 CSV --------------------------------------------------------------


def test_load_manual_csv_parses_valid_rows(tmp_path: Path):
    csv_path = tmp_path / "on3.csv"
    csv_path.write_text(
        "player_name,school,position,nil_value_usd\n"
        "Garrett Nussmeier,LSU,QB,\"$1,500,000\"\n"
        "Ryan Williams,Alabama,WR,2100000\n"
        "John Doe,Vanderbilt,K,10000\n"
        "Blank Target,Kentucky,S,\n"
    )
    labels = load_manual_csv(csv_path)
    assert sorted((l.player_name, l.nil_value_usd) for l in labels) == [
        ("Garrett Nussmeier", 1_500_000.0),
        ("Ryan Williams", 2_100_000.0),
    ]


def test_load_manual_csv_missing_file_raises(tmp_path: Path):
    with pytest.raises(FileNotFoundError):
        load_manual_csv(tmp_path / "nope.csv")


def test_load_manual_csv_missing_columns_raises(tmp_path: Path):
    csv_path = tmp_path / "bad.csv"
    csv_path.write_text("player_name,school\nA,B\n")
    with pytest.raises(ValueError):
        load_manual_csv(csv_path)


def test_index_by_name_school_deduplicates_keeping_max():
    labels = [
        NILLabel("Garrett Nussmeier", "LSU", "QB", 1_000_000.0),
        NILLabel("Garrett Nussmeier", "LSU", "QB", 1_500_000.0),
    ]
    idx = index_by_name_school(labels)
    assert idx[("garrett nussmeier", "lsu")].nil_value_usd == 1_500_000.0


def test_scrape_on3_refuses_without_consent():
    with pytest.raises(PermissionError):
        list(scrape_on3_rankings(["https://example.com"]))


# --- Knight-Newhouse ------------------------------------------------------


def test_load_school_revenue_filters_year_and_conference(tmp_path: Path):
    csv_path = tmp_path / "kn.csv"
    csv_path.write_text(
        "school,fiscal_year,total_revenue_usd\n"
        "Alabama,2025,200000000\n"
        "Alabama,2024,180000000\n"
        "Ohio State,2025,250000000\n"
    )
    out = load_school_revenue(csv_path, fiscal_year=2025, sec_teams=["Alabama", "Georgia"])
    assert out == {"Alabama": 200_000_000.0}


def test_load_school_revenue_missing_file_raises(tmp_path: Path):
    with pytest.raises(FileNotFoundError):
        load_school_revenue(tmp_path / "nope.csv", 2025, ["Alabama"])


# --- Social media ---------------------------------------------------------


def test_load_follower_counts_sums_instagram_and_x(tmp_path: Path):
    csv_path = tmp_path / "s.csv"
    csv_path.write_text(
        "player_name,school,instagram_followers,x_followers\n"
        "Garrett Nussmeier,LSU,250000,30000\n"
        "Unknown Player,Auburn,,\n"
    )
    out = load_follower_counts(csv_path)
    assert out[("garrett nussmeier", "lsu")] == 280_000.0
    assert out[("unknown player", "auburn")] is None


def test_load_follower_counts_missing_file_returns_empty(tmp_path: Path):
    assert load_follower_counts(tmp_path / "missing.csv") == {}


# --- Position normalization ----------------------------------------------


def test_normalize_position_handles_lb_synonyms():
    assert _normalize_position("ILB", ["MLB"]) == "MLB"
    assert _normalize_position("MLB", ["MLB"]) == "MLB"
    assert _normalize_position("DL", ["MLB"]) is None


def test_normalize_class_year_handles_variants():
    assert _normalize_class_year("FR") == "FR"
    assert _normalize_class_year("Junior") == "JR"
    assert _normalize_class_year(4) == "SR"
    assert _normalize_class_year(None) is None
