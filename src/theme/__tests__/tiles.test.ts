import { restaurantTile, hashString, type Tile } from '../tiles';

describe('restaurantTile', () => {
  it('is deterministic for the same id + category', () => {
    expect(restaurantTile('abc', 'tasca')).toEqual(restaurantTile('abc', 'tasca'));
  });

  it('derives tint from the category', () => {
    expect(restaurantTile('x', 'cervejaria').tint).toBe('#1446C8');
    expect(restaurantTile('x', 'tasca').tint).toBe('#F4B740');
    expect(restaurantTile('x', 'marisqueira').tint).toBe('#6FA8FF');
    expect(restaurantTile('x', 'other').tint).toBe('#64748B');
  });

  it('always uses the porcelain background', () => {
    expect(restaurantTile('abc', 'tasca').bg).toBe('#F3F6FC');
  });

  it('falls back to the "other" tint for an unknown category, never throws', () => {
    // @ts-expect-error exercising a bad runtime value
    expect(() => restaurantTile('x', 'nope')).not.toThrow();
    // @ts-expect-error
    expect(restaurantTile('x', 'nope').tint).toBe('#64748B');
  });

  it('picks a motif that varies across ids', () => {
    const motifs = new Set(
      ['a', 'b', 'c', 'd', 'e', 'f'].map((i) => restaurantTile(i, 'tasca').motif),
    );
    expect(motifs.size).toBeGreaterThan(1);
  });

  it('only ever returns a known motif', () => {
    const allowed: Tile['motif'][] = ['quatrefoil', 'star', 'wave'];
    for (const i of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      expect(allowed).toContain(restaurantTile(i, 'tasca').motif);
    }
  });
});

describe('hashString', () => {
  it('is deterministic and non-negative', () => {
    expect(hashString('abc')).toBe(hashString('abc'));
    expect(hashString('abc')).toBeGreaterThanOrEqual(0);
  });

  it('handles the empty string without throwing', () => {
    expect(() => hashString('')).not.toThrow();
  });
});
