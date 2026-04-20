# Game-by-Game NIL Performance Tracker

Tracks how each SEC player's NIL value changes week by week across the 2025
season, starting from a known initial value and adjusting it up or down based
on each game's performance relative to position-specific expectations.

This is a companion to the season-level NIL valuation model in the parent
directory. The season model predicts a baseline NIL from aggregated stats.
This tracker shows the trajectory over time.

## How It Works

1. **Load initial NIL values** from `/Users/alexisharvey/Downloads/players.json`.
2. **Fetch game-by-game stats** for each player from the CFBD API (cached).
3. **Score each game** using position-specific baselines defined in
   `config/tracker_config.yaml`. The score reflects how far above or below
   expectations the player performed, adjusted for opponent strength and
   game outcome.
4. **Adjust the NIL value** using a rules-based engine with momentum
   (streaks compound), recency (late-season games weigh more), decay
   (extreme spikes normalize), and a configurable floor.
5. **Output a JSON file** with each player's full game-by-game trajectory.

## Usage

All commands run from `~/Desktop/GITHUB/ml/`:

```bash
# Full pipeline (all tracked players)
python -m tracker.pipeline

# Single player
python -m tracker.pipeline --player "Garrett Nussmeier"

# Custom output path
python -m tracker.pipeline --output tracker/output/nil_trajectories.json

# Run tests
pytest tracker/tests/
```

## Configuration

All tunable parameters live in `tracker/config/tracker_config.yaml`:

- **baselines**: per-position stat averages and weights that define what an
  "average" game looks like.
- **adjustment.base_multiplier**: how much a 1.0 performance score moves the
  NIL (as a fraction of current value).
- **adjustment.max_pct_change_per_game**: caps extreme swings.
- **adjustment.floor_pct**: NIL never drops below this fraction of the
  initial value (default 30%).
- **adjustment.momentum**: consecutive good/bad games compound via a streak
  bonus.
- **adjustment.recency**: later-season games carry more weight.
- **adjustment.decay**: extreme deviations from the running average are pulled
  back gradually if not sustained.
- **adjustment.opponent_strength**: scales the performance score based on
  opponent Elo rating.
- **adjustment.win_loss**: small bonus for wins, small penalty for losses.

## Output Format

See `tracker/output/nil_trajectories.json` after a run. Each player entry
includes:

- `initial_nil_value` and `final_nil_value`
- `total_change` and `total_change_pct`
- Per-game breakdown with stats, performance score, NIL delta, and running
  NIL value.

## Design

This is intentionally rules-based rather than a neural network. A coach or
analyst can read the config and understand exactly why a player's NIL moved
after any given game. If the scoring or adjustment logic is ever replaced
with a learned model, the interface (performance_score returns a float,
nil_adjuster consumes it) makes that a drop-in swap.
