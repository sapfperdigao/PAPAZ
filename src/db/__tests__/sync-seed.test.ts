import { sql } from 'drizzle-orm';
import { makeTestDb } from '../testDb';
import { restaurants } from '../schema';
import { syncSeedData } from '../seed';
import { lisbonSeed } from '../seeds/lisbon-restaurants';
import * as repo from '../repo';

describe('syncSeedData', () => {
  it('fully seeds an empty db and stamps the version', async () => {
    const { db } = makeTestDb();
    const res = await syncSeedData(db);
    expect(res.seeded).toBe(lisbonSeed.length);
    expect(db.select().from(restaurants).all()).toHaveLength(lisbonSeed.length);
  });

  it('is a no-op once the db is already at the current seed version', async () => {
    const { db } = makeTestDb();
    await syncSeedData(db);
    const count = db.select().from(restaurants).all().length;
    const res = await syncSeedData(db);
    expect(res).toEqual({ seeded: 0, inserted: 0, refreshed: 0 });
    expect(db.select().from(restaurants).all()).toHaveLength(count);
  });

  it('refreshes seed ratings on an existing row without touching user data, and inserts the rest', async () => {
    const { db } = makeTestDb();
    const now = new Date().toISOString();

    // A scored seed entry, simulated as an "old install": present but unscored,
    // with user-owned data attached.
    const target = lisbonSeed.find((r) => (r.ratings?.length ?? 0) > 0)!;
    const id = 'old-install-row';
    db.insert(restaurants)
      .values({
        id,
        name: target.name,
        category: target.category,
        zone: target.zone ?? target.city ?? undefined,
        bookmarked: 1,
        visited: 1,
        created_at: now,
      })
      .run();
    repo.setPersonalRating(db, id, 4.5); // user's own rating (source 'personal')
    repo.addVisit(db, id, { visited_at: now, personal_rating: 4.5, personal_notes: 'mine' });

    // Mark the DB as behind the current seed version.
    db.run(sql`INSERT OR REPLACE INTO app_meta (key, value) VALUES ('seed_version', '0')`);

    const res = await syncSeedData(db);

    // New seed restaurants were added; count == starting 1 + inserted (nothing deleted).
    expect(res.inserted).toBeGreaterThan(0);
    expect(res.refreshed).toBeGreaterThanOrEqual(1);
    expect(db.select().from(restaurants).all()).toHaveLength(1 + res.inserted);

    // The matched row gained the seed's crowd ratings…
    const rts = repo.getRatings(db, id);
    expect(rts.filter((r) => r.source !== 'personal')).toHaveLength(target.ratings!.length);
    // …and kept everything the user owned.
    expect(rts.some((r) => r.source === 'personal')).toBe(true);
    const row = repo.getRestaurant(db, id)!;
    expect(row.bookmarked).toBe(1);
    expect(row.visited).toBe(1);
    expect(repo.getVisits(db, id)).toHaveLength(1);
  });
});
