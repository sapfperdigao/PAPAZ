import { makeTestDb } from '../testDb';
import { seedIfEmpty } from '../seed';
import * as repo from '../repo';

async function seeded() {
  const { db } = makeTestDb();
  await seedIfEmpty(db);
  return db;
}

describe('repo.listRestaurants', () => {
  it('sorts by name alphabetically', async () => {
    const db = await seeded();
    const names = repo.listRestaurants(db, { sort: 'name' }).map((r) => r.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('filters by category', async () => {
    const db = await seeded();
    const items = repo.listRestaurants(db, { sort: 'name', categories: ['tasca'] });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((r) => r.category === 'tasca')).toBe(true);
  });

  it('filters by bookmarked and reflects setBookmark', async () => {
    const db = await seeded();
    const all = repo.listRestaurants(db, { sort: 'name' });
    expect(repo.listRestaurants(db, { sort: 'name', bookmarkedOnly: true })).toHaveLength(0);

    repo.setBookmark(db, all[0].id, true);

    const booked = repo.listRestaurants(db, { sort: 'name', bookmarkedOnly: true });
    expect(booked).toHaveLength(1);
    expect(booked[0].id).toBe(all[0].id);
  });

  it('sorts rated restaurants before unrated, unrated last', async () => {
    const db = await seeded();
    const all = repo.listRestaurants(db, { sort: 'name' });
    repo.setPersonalRating(db, all[2].id, 5);

    const byRating = repo.listRestaurants(db, { sort: 'rating' });
    expect(byRating[0].id).toBe(all[2].id);
    expect(byRating[0].personalRating).toBe(5);
    expect(byRating[byRating.length - 1].personalRating).toBeNull();
  });

  it('computes distance when an origin is given and sorts by it', async () => {
    const db = await seeded();
    // Origin near Chiado — Tasca do Chico / Trindade should be closest.
    const items = repo.listRestaurants(db, {
      sort: 'distance',
      origin: { lat: 38.711, lng: -9.1448 },
    });
    expect(items[0].distanceKm).not.toBeNull();
    for (let i = 1; i < items.length; i++) {
      expect(items[i].distanceKm! >= items[i - 1].distanceKm!).toBe(true);
    }
  });
});

describe('repo mutations', () => {
  it('deleteRestaurant removes it', async () => {
    const db = await seeded();
    const all = repo.listRestaurants(db, { sort: 'name' });
    repo.deleteRestaurant(db, all[0].id);
    expect(repo.listRestaurants(db, { sort: 'name' }).some((r) => r.id === all[0].id)).toBe(
      false,
    );
  });

  it('createRestaurant adds a new row returned in the list', async () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'New Tasca', category: 'tasca' });
    const all = repo.listRestaurants(db, { sort: 'name' });
    expect(all.map((r) => r.id)).toContain(id);
    expect(all.find((r) => r.id === id)!.name).toBe('New Tasca');
  });
});
