"""Tests for tracker/ingest/load_players.py."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from tracker.ingest.load_players import load_players


def _write_players(tmp_path: Path, data: dict) -> Path:
    p = tmp_path / "players.json"
    p.write_text(json.dumps(data), encoding="utf-8")
    return p


def test_load_valid_players(tmp_path: Path):
    data = {
        "100": {
            "player_id": 1,
            "first_name": "Test",
            "last_name": "QB",
            "school": "Alabama",
            "sport": "football",
            "position": "QB",
            "college_year": "Junior",
            "nil": 500000,
            "nil_delta": 0.0,
        },
        "200": {
            "player_id": 2,
            "first_name": "Test",
            "last_name": "RB",
            "school": "Alabama",
            "sport": "football",
            "position": "RB",
            "college_year": "Senior",
            "nil": 300000,
            "nil_delta": 0.0,
        },
    }
    path = _write_players(tmp_path, data)
    players = load_players(path=path)
    assert len(players) == 1
    assert players[0].name == "Test QB"
    assert players[0].initial_nil == 500000
    assert players[0].position == "QB"


def test_skips_zero_nil(tmp_path: Path):
    data = {
        "100": {
            "player_id": 1,
            "first_name": "No",
            "last_name": "NIL",
            "school": "LSU",
            "sport": "football",
            "position": "WR",
            "college_year": "Sophomore",
            "nil": 0,
            "nil_delta": 0.0,
        },
    }
    path = _write_players(tmp_path, data)
    players = load_players(path=path)
    assert len(players) == 0


def test_skips_empty_school(tmp_path: Path):
    data = {
        "100": {
            "player_id": 1,
            "first_name": "No",
            "last_name": "School",
            "school": "",
            "sport": "football",
            "position": "S",
            "college_year": "Junior",
            "nil": 400000,
            "nil_delta": 0.0,
        },
    }
    path = _write_players(tmp_path, data)
    players = load_players(path=path)
    assert len(players) == 0


def test_missing_file_raises(tmp_path: Path):
    with pytest.raises(FileNotFoundError):
        load_players(path=tmp_path / "nope.json")


def test_loads_all_tracked_positions(tmp_path: Path):
    data = {}
    for i, pos in enumerate(["QB", "WR", "TE", "LB", "S"]):
        data[str(i)] = {
            "player_id": i,
            "first_name": f"Player{i}",
            "last_name": pos,
            "school": "Georgia",
            "sport": "football",
            "position": pos,
            "college_year": "Senior",
            "nil": 100000 * (i + 1),
            "nil_delta": 0.0,
        }
    path = _write_players(tmp_path, data)
    players = load_players(path=path)
    assert len(players) == 5
    positions = {p.position for p in players}
    assert positions == {"QB", "WR", "TE", "LB", "S"}
