import { makeTestDb } from '../testDb';
import * as repo from '../repo';

describe('listRestaurants consensus integration', () => {
  it('attaches a consensus score computed from the ratings rows', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'A', category: 'tasca' });
    // TripAdvisor 4.0/5 (dead average) with high volume → consensus ≈ 7.0.
    repo.upsertManualScore(db, id, 'tripadvisor', 4.0, 12000);

    const item = repo.listRestaurants(db, { sort: 'name' }).find((r) => r.id === id)!;
    expect(item.consensus).not.toBeNull();
    expect(item.consensus!).toBeGreaterThan(6.5);
    expect(item.consensus!).toBeLessThan(7.5);
  });

  it('leaves consensus null when a restaurant has no ratings', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'A', category: 'tasca' });
    const item = repo.listRestaurants(db, { sort: 'name' }).find((r) => r.id === id)!;
    expect(item.consensus).toBeNull();
  });

  it('applies the editorial bonus from editorial_json', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'A', category: 'tasca' });
    repo.upsertManualScore(db, id, 'tripadvisor', 4.0, 12000);
    repo.setEditorial(db, id, { michelinStars: 1 });

    const item = repo.listRestaurants(db, { sort: 'name' }).find((r) => r.id === id)!;
    // 7.0 crowd + 0.4 Michelin star bonus.
    expect(item.consensus!).toBeCloseTo(7.4, 1);
  });

  it('sorts by consensus descending with unrated last', () => {
    const { db } = makeTestDb();
    const hi = repo.createRestaurant(db, { name: 'Zed', category: 'tasca' });
    const lo = repo.createRestaurant(db, { name: 'Abe', category: 'tasca' });
    const none = repo.createRestaurant(db, { name: 'Mid', category: 'tasca' });
    repo.upsertManualScore(db, hi, 'google', 4.8, 5000);
    repo.upsertManualScore(db, lo, 'tripadvisor', 3.2, 5000);

    const ids = repo.listRestaurants(db, { sort: 'consensus' }).map((r) => r.id);
    expect(ids.indexOf(hi)).toBeLessThan(ids.indexOf(lo));
    expect(ids[ids.length - 1]).toBe(none);
  });
});
