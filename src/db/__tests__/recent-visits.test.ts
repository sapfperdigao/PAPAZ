import { makeTestDb } from '../testDb';
import { createRestaurant, addVisit, listRecentVisits } from '../repo';

describe('listRecentVisits', () => {
  it('returns visits newest-first with the restaurant name, respecting the limit', () => {
    const { db } = makeTestDb();
    const a = createRestaurant(db, { name: 'Ramiro', category: 'marisqueira' });
    const b = createRestaurant(db, { name: 'Sea Me', category: 'other' });

    addVisit(db, a, { visited_at: '2026-01-01T12:00:00.000Z', personal_notes: 'oldest' });
    addVisit(db, b, { visited_at: '2026-03-01T12:00:00.000Z', personal_rating: 4, personal_notes: 'newest' });
    addVisit(db, a, { visited_at: '2026-02-01T12:00:00.000Z' });

    const recent = listRecentVisits(db, 2);
    expect(recent).toHaveLength(2);
    expect(recent[0].restaurantName).toBe('Sea Me');
    expect(recent[0].visitedAt).toBe('2026-03-01T12:00:00.000Z');
    expect(recent[0].personalNotes).toBe('newest');
    expect(recent[1].restaurantName).toBe('Ramiro');
    expect(recent[1].visitedAt).toBe('2026-02-01T12:00:00.000Z');
  });

  it('returns an empty array when there are no visits', () => {
    const { db } = makeTestDb();
    createRestaurant(db, { name: 'Empty', category: 'other' });
    expect(listRecentVisits(db, 5)).toEqual([]);
  });
});
