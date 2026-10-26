import { sql } from 'drizzle-orm';
import { makeTestDb } from '../testDb';
import { MIGRATIONS } from '../migrations';
import * as repo from '../repo';

describe('migrations integration', () => {
  it('brings a fresh db to the latest schema version', () => {
    const { db } = makeTestDb();
    const row = db.get<{ user_version: number }>(sql`PRAGMA user_version`);
    expect(row.user_version).toBe(MIGRATIONS.length);
  });

  it('has the v2 editorial_json column available', () => {
    const { db } = makeTestDb();
    const id = repo.createRestaurant(db, { name: 'X', category: 'tasca' });
    // Column exists and round-trips.
    db.run(sql`UPDATE restaurants SET editorial_json = ${'{"inMichelinGuide":true}'} WHERE id = ${id}`);
    const r = repo.getRestaurant(db, id)!;
    expect(r.editorial_json).toBe('{"inMichelinGuide":true}');
  });
});
