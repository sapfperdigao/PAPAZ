import { sql, eq } from 'drizzle-orm';
import { makeTestDb } from '../testDb';
import { restaurants, ratings } from '../schema';

describe('schema', () => {
  it('has foreign keys enabled', () => {
    const { db } = makeTestDb();
    const row = db.get<{ foreign_keys: number }>(sql`PRAGMA foreign_keys`);
    expect(row.foreign_keys).toBe(1);
  });

  it('cascades deletes from restaurant to its ratings', () => {
    const { db } = makeTestDb();
    const now = new Date().toISOString();
    db.insert(restaurants)
      .values({ id: 'r1', name: 'Tasca Test', category: 'tasca', created_at: now })
      .run();
    db.insert(ratings)
      .values({ id: 'rt1', restaurant_id: 'r1', source: 'google', score: 9.4, fetched_at: now })
      .run();

    expect(db.select().from(ratings).all()).toHaveLength(1);

    db.delete(restaurants).where(eq(restaurants.id, 'r1')).run();

    expect(db.select().from(ratings).all()).toHaveLength(0);
  });
});
