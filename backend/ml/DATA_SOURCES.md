# Data Sources

Every source used by this project, along with its access method, license, and
date of access. Update this file whenever a new source is added.

## CollegeFootballData (CFBD)

- URL: https://collegefootballdata.com
- Access: REST API via the `cfbd` Python client.
- Auth: requires a free API key in the `CFBD_API_KEY` env var.
- Data pulled: SEC rosters, season player stats, per-game player stats, team
  records, strength of schedule.
- License: CFBD data is derived from public sources and offered free for
  non-commercial use. See the site's terms for commercial use.
- Access date: 2026-04-15.

## On3 NIL Valuations

- URL: https://www.on3.com/nil/rankings/player/college/football/
- Access: the scraper in `data/ingest/on3_scraper.py` is gated on an explicit
  check of https://www.on3.com/robots.txt and the On3 Terms of Service. If
  either prohibits automated access for this path, the scraper refuses to run
  and instead reads labels from `data/cache/on3_manual.csv` (manually curated).
- Data pulled: per-player NIL valuation (USD).
- License: On3 content is copyrighted. This project uses valuations only as
  noisy labels for an academic model. Do not redistribute the underlying values.
- Access date: 2026-04-15.

## NIL Newsstand Deal Tracker

- URL: https://www.nilnewsstand.com/nil-deal-tracker
- Access: supplementary, manual copy only at this time. No automated scraper.
- Data pulled: aggregate deal counts and brand categories, used only as
  sanity-check context, not as a training label.
- Access date: 2026-04-15.

## Knight-Newhouse Athletics Database

- URL: https://knightnewhousedata.org/
- Access: one-time CSV download, stored as `data/cache/knight_newhouse_sec.csv`.
- Data pulled: total athletic revenue and expenses by SEC school by fiscal year.
- License: public data released by institutions under federal reporting
  requirements. Aggregated and published by the Knight Commission.
- Access date: 2026-04-15.

## Social Media Follower Counts

- Sources: public Instagram and X profile pages for players with a verified
  handle as listed on their school's official roster page.
- Access: one-off manual lookup stored in `data/cache/social_followers.csv` to
  avoid scraping either platform. Missing values are preserved.
- Access date: 2026-04-15.

## Ethical Notes

- No private or login-gated data is collected.
- Player identifiers use the name as listed on official school rosters. No PII
  beyond what the school itself publishes is stored.
- Follower counts are snapshotted at the access date. They are not tracked over
  time.
