import { makeTestDb } from '../testDb';
import { restaurants, dishes, ratings } from '../schema';
import { seedIfEmpty } from '../seed';
import { lisbonSeed } from '../seeds/lisbon-restaurants';

describe('seedIfEmpty', () => {
  it('inserts the sample on an empty db and reports the count', async () => {
    const { db } = makeTestDb();
    const n = await seedIfEmpty(db);
    expect(n).toBe(lisbonSeed.length);
    expect(db.select().from(restaurants).all()).toHaveLength(lisbonSeed.length);
  });

  it('is idempotent — a second call inserts nothing', async () => {
    const { db } = makeTestDb();
    await seedIfEmpty(db);
    const before = db.select().from(restaurants).all().length;
    const n = await seedIfEmpty(db);
    expect(n).toBe(0);
    expect(db.select().from(restaurants).all()).toHaveLength(before);
  });

  it('inserts the ratings and dish notes from the seed', async () => {
    const { db } = makeTestDb();
    await seedIfEmpty(db);
    const totalRatings = lisbonSeed.reduce((s, r) => s + (r.ratings?.length ?? 0), 0);
    const totalDishes = lisbonSeed.reduce((s, r) => s + (r.dish_notes ? 1 : 0), 0);
    expect(db.select().from(ratings).all()).toHaveLength(totalRatings);
    expect(db.select().from(dishes).all()).toHaveLength(totalDishes);
  });
});
