import { normalizeScore } from '../normalizeRating';

describe('normalizeScore', () => {
  it('doubles a Google 5-star rating (4.7 -> 9.4)', () => {
    expect(normalizeScore('google', 4.7)).toBeCloseTo(9.4);
  });

  it('keeps a TheFork 0-10 score as-is (8.0 -> 8.0)', () => {
    expect(normalizeScore('thefork', 8.0)).toBe(8.0);
  });

  it('doubles a TripAdvisor 5-star rating (4.0 -> 8.0)', () => {
    expect(normalizeScore('tripadvisor', 4.0)).toBe(8.0);
  });

  it('doubles a personal 5-star rating (4.0 -> 8.0)', () => {
    expect(normalizeScore('personal', 4.0)).toBe(8.0);
  });
});
