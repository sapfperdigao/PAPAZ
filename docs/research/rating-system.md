# Mesa consensus rating — method & calibration

**Status:** implemented in `src/scoring/consensus.ts`, wired through `src/db/repo.ts` (consensus sort, `getConsensus`) and the UI (card badge, Overview headline).

## Why not a simple average
Raw sources cluster high and on different scales/distributions: on this list TheFork averages **9.28/10** (sd 0.28), Google **8.98/10** (×2), TripAdvisor **8.44/10**. A naive ×2 rescale makes almost everything read 8.5–9.5 — useless for ranking, and TheFork dominates. The hand-compiled `Lisbon_Restaurant_Ratings.md` avoided this by mentally mean-centering and penalising; this formula does it deterministically.

## The formula (per restaurant, over present sources only)
1. **Rescale** each source to 0–10 (`raw × 10/max`). Stored `ratings.score` is already this.
2. **Distribution-normalise** — z-score vs the source's mean/σ, re-expressed on a common axis: `norm = TARGET_MEAN + TARGET_SD · (r10 − μ[s]) / σ[s]`, clamped 0–10. Reddit/personal are already honest 0–10 sentiment → no z-norm.
3. **Volume shrinkage** (IMDb-style Bayesian average) toward the prior: `adj = v/(v+M)·norm + M/(v+M)·TARGET_MEAN`, `M = 50`. So 9.9-from-86-reviews can't outrank 9.2-from-10k.
4. **Source trust weights:** personal 1.5, google 0.9, tripadvisor 0.7, thefork/opentable 0.6, reddit 0.5.
5. **Editorial as a capped bonus** (≤ 0.5): Michelin ★ 0.4 (2–3★ 0.5), Guide/Bib 0.25, Repsol 0.3/sol, Time Out 0.2, local "101" 0.2, press 0.1 each. Added after the weighted crowd blend, never averaged in.
6. **Recency:** skipped — we store only current cumulative scores; flag sources older than 12 months instead.

## Calibration (the important part)
Constants are **not global averages** — they are calibrated to the distribution of the user's own 103-restaurant hand-scored list (the relevant population, "restaurants worth listing"):

- `μ`: google 8.98, tripadvisor 8.44, thefork 9.28, opentable 9.7 (0–10 axis)
- `σ`: flat 1.0 · `TARGET_MEAN` 7.2 · `TARGET_SD` 1.2 · `M` 50 · editorial cap 0.5

Measured against the 89 hand-scored restaurants with parseable per-source data:

| | global-mean constants | **calibrated** |
|---|---|---|
| systematic bias (formula − hand) | +0.50 | **≈ 0** |
| mean abs error | 0.70 | **0.43** |
| spread (sd), hand = 0.63 | 0.94 | **0.67** |
| correlation | 0.68 | **0.70** |

The residual (r ≈ 0.70, not higher) is the "touristy / overpriced / inconsistent" sentiment applied by hand that no crowd score captures — the honest ceiling for a crowd-data formula. Closing it further would need review-text sentiment (the deferred Reddit/press track).

## Data provenance
- 100 restaurants: per-source scores + editorial parsed from `Lisbon_Restaurant_Ratings.md`.
- 126 restaurants: pending web research (blocked by a `WebSearch` deny rule at time of writing); seeded unrated until researched.
