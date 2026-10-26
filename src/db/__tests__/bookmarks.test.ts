import { bookmarkSubfilter, type RestaurantListItem } from '../repo';

function item(over: Partial<RestaurantListItem>): RestaurantListItem {
  return {
    id: 'r1',
    name: 'X',
    address: null,
    zone: null,
    category: 'tasca',
    price_range: null,
    latitude: null,
    longitude: null,
    website: null,
    phone: null,
    google_place_id: null,
    thefork_url: null,
    tripadvisor_url: null,
    bookmarked: 1,
    visited: 0,
    created_at: '2026-01-01T00:00:00.000Z',
    personalRating: null,
    distanceKm: null,
    ...over,
  };
}

describe('bookmarkSubfilter', () => {
  it('excludes non-bookmarked restaurants in every mode', () => {
    const r = item({ bookmarked: 0 });
    expect(bookmarkSubfilter(r, 'all')).toBe(false);
    expect(bookmarkSubfilter(r, 'want-to-try')).toBe(false);
    expect(bookmarkSubfilter(r, 'visited-loved')).toBe(false);
  });

  it('want-to-try = bookmarked and not visited', () => {
    expect(bookmarkSubfilter(item({ visited: 0 }), 'want-to-try')).toBe(true);
    expect(bookmarkSubfilter(item({ visited: 1 }), 'want-to-try')).toBe(false);
  });

  it('visited-loved = bookmarked, visited, personal rating >= 4.0', () => {
    expect(bookmarkSubfilter(item({ visited: 1, personalRating: 4.0 }), 'visited-loved')).toBe(true);
    expect(bookmarkSubfilter(item({ visited: 1, personalRating: 3.5 }), 'visited-loved')).toBe(false);
    expect(bookmarkSubfilter(item({ visited: 0, personalRating: 5 }), 'visited-loved')).toBe(false);
  });

  it('all = any bookmarked restaurant', () => {
    expect(bookmarkSubfilter(item({ visited: 1, personalRating: 1 }), 'all')).toBe(true);
  });
});
