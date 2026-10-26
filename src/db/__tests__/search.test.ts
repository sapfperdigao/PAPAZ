import { makeTestDb } from '../testDb';
import * as repo from '../repo';

// Controlled fixtures so the tests don't depend on seed-data specifics.
function seeded() {
  const { db } = makeTestDb();
  repo.createRestaurant(db, {
    name: 'Cervejaria Ramiro',
    category: 'cervejaria',
    zone: 'Intendente',
    address: 'Av. Almirante Reis 1',
  });
  repo.createRestaurant(db, { name: 'O Zé dos Cornos', category: 'tasca', zone: 'Mouraria' });
  repo.createRestaurant(db, {
    name: 'A Taberna da Rua das Flores',
    category: 'tasca',
    zone: 'Chiado',
  });
  repo.createRestaurant(db, { name: 'Cervejaria Trindade', category: 'cervejaria', zone: 'Chiado' });
  return db;
}

describe('listRestaurants search (FTS5)', () => {
  it('matches a zone token', () => {
    const db = seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'Chiado' });
    expect(items.length).toBe(2);
    expect(items.every((r) => r.zone === 'Chiado')).toBe(true);
  });

  it('matches an address token', () => {
    const db = seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'almirante' });
    expect(items.some((r) => r.name === 'Cervejaria Ramiro')).toBe(true);
  });

  it('matches an accented name from an ascii query (ze -> Zé)', () => {
    const db = seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'ze' });
    expect(items.some((r) => r.name.includes('Zé'))).toBe(true);
  });

  it('matches an accented name typed with the accent', () => {
    const db = seeded();
    const items = repo.listRestaurants(db, { sort: 'name', search: 'Zé' });
    expect(items.some((r) => r.name.includes('Zé'))).toBe(true);
  });

  it('returns all for an empty / whitespace query', () => {
    const db = seeded();
    const all = repo.listRestaurants(db, { sort: 'name' });
    expect(repo.listRestaurants(db, { sort: 'name', search: '   ' })).toHaveLength(all.length);
  });

  it('does not throw on a punctuation-only query', () => {
    const db = seeded();
    expect(() => repo.listRestaurants(db, { sort: 'name', search: '!!!' })).not.toThrow();
  });
});
