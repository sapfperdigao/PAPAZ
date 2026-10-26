import { eq } from 'drizzle-orm';
import { makeTestDb } from '../testDb';
import * as repo from '../repo';
import { ratings, dishes, wines, visits } from '../schema';

describe('deleteRestaurant cascade (Review Focus #2)', () => {
  it('removes every child row across ratings, dishes, wines and visits', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    repo.upsertManualScore(db, id, 'thefork', 8);
    repo.addDish(db, id, { name: 'Gambas' });
    repo.addWine(db, id, { name: 'Quinta', wine_type: 'red' });
    repo.addVisit(db, id, { visited_at: new Date().toISOString(), personal_notes: 'nice' });

    // Sanity: children exist before the delete.
    expect(db.select().from(ratings).where(eq(ratings.restaurant_id, id)).all()).toHaveLength(1);

    repo.deleteRestaurant(db, id);

    expect(db.select().from(ratings).where(eq(ratings.restaurant_id, id)).all()).toHaveLength(0);
    expect(db.select().from(dishes).where(eq(dishes.restaurant_id, id)).all()).toHaveLength(0);
    expect(db.select().from(wines).where(eq(wines.restaurant_id, id)).all()).toHaveLength(0);
    expect(db.select().from(visits).where(eq(visits.restaurant_id, id)).all()).toHaveLength(0);
  });
});
