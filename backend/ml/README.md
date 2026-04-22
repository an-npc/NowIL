# SEC NIL Valuation Model

PyTorch-based machine learning pipeline for predicting Name, Image, and Likeness
(NIL) valuations for active SEC football players. Built as the ML component of
a collegiate NIL tracking app.

## Scope

- Sport: Football
- Conference: SEC
- Positions: QB, WR, TE, MLB, S
- Season: 2025 (most recent completed), with ingest capability for 2026 in-season

## Architecture Decision

One model per sport, with positions encoded via a learned embedding rather than
training five separate position models. This lets the model share representation
of shared contextual features (team strength, school revenue, social reach)
while still letting position-specific stat patterns diverge.

## Inference Modes

1. Season mode: aggregated season stats produce a projected NIL value.
2. Real-time mode: recent game stats produce an updated NIL value via the LSTM
   adjustment head.

## Project Layout

```
config/                     sport config and hyperparameters
data/
  schema.py                 pydantic models
  ingest/                   source-specific loaders
  build_dataset.py          join and label pipeline
  preprocessing.py          feature engineering
models/                     pytorch and baseline model definitions
training/                   train and evaluate loops
inference/                  batch and streaming prediction
notebooks/demo.ipynb        five-player end-to-end demo
tests/                      pytest suite
```

## Setup

```bash
cd ~/Desktop/GITHUB/ml
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and add your CFBD_API_KEY
```

## Workflow

All commands run from `~/Desktop/GITHUB/ml/`.

```bash
# 1. Ingest
python -m data.ingest.cfbd_client --conference SEC --season 2025 --positions QB,WR,TE,MLB,S
python -m data.ingest.on3_scraper --conference SEC
python -m data.build_dataset --output data/sec_2025.csv

# 2. Train
python -m training.train --config config/sec_football_config.yaml

# 3. Evaluate
python -m training.evaluate --checkpoint training/checkpoints/best.pt

# 4. Predict
python -m inference.predict_season --player "Garrett Nussmeier" --season 2025
python -m inference.predict_realtime --player "Garrett Nussmeier" --last-n-games 3
```

## Data Sources

See `DATA_SOURCES.md` for per-source license, access date, and access method.

- CFBD API: primary performance data (rosters, season stats, game stats).
- On3 NIL Valuations: primary NIL label source. Scraping is gated on ToS and
  robots.txt checks. Fallback path: manual CSV at `data/cache/on3_manual.csv`.
- Knight-Newhouse Athletics DB: SEC school athletic revenue, one-time CSV.
- Social media: public Instagram and X follower counts where a verified handle
  exists. Missing values are preserved; the model handles them.

## Data Quality Notes

- On3 valuations are model-based estimates, not transaction records. Treat them
  as noisy labels. Reported errors should be read with this in mind.
- Sample size is small. Expect 50 to 150 SEC players across the five positions
  with public valuations. We use k-fold cross-validation, not a single holdout
  split.
- Defensive positions (MLB, S) have sparser NIL coverage than offensive skill
  positions. Per-position MAE is reported separately for this reason.
- Target is modeled as log(NIL + 1) to tame the heavy right tail driven by a
  handful of star QBs. Loss is Huber to further reduce outlier leverage.

## Ethics and Legal

- No non-public personal information is collected or stored.
- Every scraper respects robots.txt and applies conservative rate limiting.
- Scraped responses are cached under `data/cache/` so reruns do not hammer
  sources.
- All data sources used are public. See `DATA_SOURCES.md`.

## Running Tests

```bash
pytest tests/
```

Tests use mocked API responses and do not require a CFBD key or network access.
