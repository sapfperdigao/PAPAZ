// Consensus restaurant score (0–10) — a deterministic, on-device blend of
// multiple rating sources. Method (from research brief): normalize each
// source for its own distribution FIRST (z-score vs known μ/σ, re-centered to
// a common 7.0), THEN shrink for review volume (Bayesian average toward 7.0),
// THEN apply source trust weights, THEN add a capped editorial bonus, THEN
// clamp. This is what stops TheFork's compressed ~9 cluster from dominating a
// naive average.
//
// Input `score` is already on a 0–10 axis (our ratings.score is stored
// normalized, i.e. raw × 10/max). `reviewCount` is that source's volume.

export const TARGET_MEAN = 7.0; // where an average restaurant lands, and the Bayesian prior
export const TARGET_SD = 1.2;
export const SHRINK_M = 50; // reviews at which a source's own mean carries ~half the weight
export const EDITORIAL_CAP = 0.5;

// Per-source global mean/σ on the 0–10 axis (approximate published/observed
// central tendencies). Sources absent here (reddit, personal) are treated as
// already-honest 0–10 sentiment and are NOT distribution-normalized.
const DIST: Record<string, { mu: number; sigma: number }> = {
  google: { mu: 8.4, sigma: 0.6 },
  tripadvisor: { mu: 8.0, sigma: 0.8 },
  opentable: { mu: 8.6, sigma: 0.6 },
  thefork: { mu: 9.0, sigma: 0.4 },
};

// Source trust weights. Editorial is handled separately (capped bonus).
const WEIGHT: Record<string, number> = {
  personal: 1.5,
  google: 0.9,
  tripadvisor: 0.7,
  thefork: 0.6,
  opentable: 0.6,
  reddit: 0.5,
};
const DEFAULT_WEIGHT = 0.5;

export interface SourceInput {
  source: string;
  score: number; // 0–10
  reviewCount: number;
}

export interface EditorialSignals {
  michelinStars?: number; // 1, 2, or 3
  inMichelinGuide?: boolean; // listed / Bib Gourmand, not starred
  repsolSoles?: number; // Guia Repsol "soles"
  timeOut?: boolean;
  best101?: boolean; // local "101 best" list
  pressMentions?: number;
}

export interface Consensus {
  score: number; // 0–10, rounded to 0.1
  band: number; // +/- uncertainty, widens with few sources / low volume
  sourceCount: number;
  totalReviews: number;
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

function sourceScore(input: SourceInput): number {
  const dist = DIST[input.source];
  let norm: number;
  if (dist) {
    const z = (input.score - dist.mu) / dist.sigma;
    norm = clamp(TARGET_MEAN + TARGET_SD * z, 0, 10);
  } else {
    norm = clamp(input.score, 0, 10);
  }
  const v = Math.max(input.reviewCount, 1);
  // Bayesian shrinkage toward the prior mean.
  return (v / (v + SHRINK_M)) * norm + (SHRINK_M / (v + SHRINK_M)) * TARGET_MEAN;
}

export function editorialBonus(e?: EditorialSignals): number {
  if (!e) return 0;
  let points = 0;
  if (e.michelinStars && e.michelinStars >= 2) points += 0.5;
  else if (e.michelinStars === 1) points += 0.4;
  else if (e.inMichelinGuide) points += 0.25;
  if (e.repsolSoles) points += 0.3 * e.repsolSoles;
  if (e.timeOut) points += 0.2;
  if (e.best101) points += 0.2;
  if (e.pressMentions) points += 0.1 * e.pressMentions;
  return Math.min(EDITORIAL_CAP, points);
}

export function consensusScore(
  sources: SourceInput[],
  editorial?: EditorialSignals,
): Consensus | null {
  if (sources.length === 0) return null;

  let num = 0;
  let den = 0;
  let totalReviews = 0;
  for (const s of sources) {
    const w = WEIGHT[s.source] ?? DEFAULT_WEIGHT;
    num += w * sourceScore(s);
    den += w;
    totalReviews += Math.max(s.reviewCount, 0);
  }
  const crowd = den > 0 ? num / den : TARGET_MEAN;
  const score = clamp(crowd + editorialBonus(editorial), 0, 10);

  const n = sources.length;
  const band =
    0.5 * (1 - Math.min(1, totalReviews / 500)) + 0.15 * (3 - Math.min(3, n));

  return {
    score: Math.round(score * 10) / 10,
    band: Math.round(band * 100) / 100,
    sourceCount: n,
    totalReviews,
  };
}
