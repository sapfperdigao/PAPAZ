import { makeTestDb } from '../testDb';
import * as repo from '../repo';

describe('updateRestaurant', () => {
  it('clears an optional field when the patch sets it to undefined (edit-clear)', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'X', category: 'tasca', phone: '911222333' });
    expect(repo.getRestaurant(db, id)!.phone).toBe('911222333');

    // Edit form submits every field; a cleared field arrives as undefined.
    repo.updateRestaurant(db, id, {
      name: 'X',
      category: 'tasca',
      price_range: '€€',
      phone: undefined,
    });

    expect(repo.getRestaurant(db, id)!.phone).toBeNull();
    expect(repo.getRestaurant(db, id)!.price_range).toBe('€€');
  });

  it('updates provided fields', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'Old', category: 'tasca' });
    repo.updateRestaurant(db, id, { name: 'New', category: 'cervejaria' });
    const r = repo.getRestaurant(db, id)!;
    expect(r.name).toBe('New');
    expect(r.category).toBe('cervejaria');
  });
});

describe('upsertManualScore', () => {
  it('replaces the existing score for a source instead of duplicating', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    repo.upsertManualScore(db, id, 'thefork', 7);
    repo.upsertManualScore(db, id, 'thefork', 9);

    const thefork = repo.getRatings(db, id).filter((r) => r.source === 'thefork');
    expect(thefork).toHaveLength(1);
    expect(thefork[0].score).toBe(9);
  });
});
