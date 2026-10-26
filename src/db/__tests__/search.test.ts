import { makeTestDb } from '../testDb';
import { seedIfEmpty } from '../seed';
import * as repo from '../repo';

async function seeded() {
  const { db } = makeTestDb();
  await seedIfEmpty(db);
  return db;
}

describe('listRestaurants search (FTS5)', () => {
  it('matches a zone token', async () => {
    const db = await seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'Chiado' });
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.every((r) => r.zone === 'Chiado')).toBe(true);
  });

  it('matches an address token', async () => {
    const db = await seeded();
    // Cervejaria Ramiro's sample address contains "Almirante".
    const items = repo.listRestaurants(db, { sort: 'name', search: 'almirante' });
    expect(items.some((r) => r.name === 'Cervejaria Ramiro')).toBe(true);
  });

  it('matches an accented name from an ascii query (ze -> Zé)', async () => {
    const db = await seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'ze' });
    expect(items.some((r) => r.name.includes('Zé'))).toBe(true);
  });

  it('matches an accented name typed with the accent', async () => {
    const db = await seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'Zé' });
    expect(items.some((r) => r.name.includes('Zé'))).toBe(true);
  });

  it('returns all for an empty / whitespace query', async () => {
    const db = await seeded();
    const all = repo.listRestaurants(db, { sort: 'name' });
    expect(repo.listRestaurants(db, { sort: 'name', search: '   ' })).toHaveLength(all.length);
  });

  it('does not throw on a punctuation-only query', async () => {
    const db = await seeded();
    expect(() => repo.listRestaurants(db, { sort: 'name', search: '!!!' })).not.toThrow();
  });
});
