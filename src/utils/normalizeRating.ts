import type { RatingSource } from '@/domain';

// Factor to normalize each source's native scale onto 0–10 (spec §6).
// TheFork is already 0–10; Google/TripAdvisor/Personal are 0–5 stars (×2).
// Reddit carries no numeric score in the spec — treated as already 0–10.
const FACTOR: Record<RatingSource, number> = {
  google: 2,
  tripadvisor: 2,
  personal: 2,
  thefork: 1,
  reddit: 1,
};

export function normalizeScore(source: RatingSource, raw: number): number {
  return raw * FACTOR[source];
}
