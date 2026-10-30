import { restaurantTile, hashString, type Tile } from '../tiles';

describe('restaurantTile', () => {
  it('is deterministic for the same id + category', () => {
    expect(restaurantTile('abc', 'tasca')).toEqual(restaurantTile('abc', 'tasca'));
  });

  it('derives a vibrant tint from the id, varying across ids', () => {
    const allowed = ['#1446C8', '#2E8B9A', '#7C3AED', '#C98A1E', '#2E6BE0', '#B23A8E'];
    expect(allowed).toContain(restaurantTile('abc', 'tasca').tint);
    const tints = new Set(
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((i) => restaurantTile(i, 'other').tint),
    );
    expect(tints.size).toBeGreaterThan(1);
  });

  it('tint depends on the id, not the category', () => {
    expect(restaurantTile('abc', 'tasca').tint).toBe(restaurantTile('abc', 'other').tint);
  });

  it('always uses the porcelain background', () => {
    expect(restaurantTile('abc', 'tasca').bg).toBe('#F3F6FC');
  });

  it('handles an unknown category without throwing', () => {
    // @ts-expect-error exercising a bad runtime value
    expect(() => restaurantTile('x', 'nope')).not.toThrow();
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
