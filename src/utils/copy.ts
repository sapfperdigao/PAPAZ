// Centralized UI copy (DESIGN_PLAN §8.2) — keeps strings out of components so a
// future locale switch is cheap, without pulling in an i18n framework now.

// Time-based Portuguese greeting. Injectable date for testing.
export function greeting(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 19) return 'Boa tarde';
  return 'Boa noite';
}

export const COPY = {
  tagline: 'Where to eat in Lisbon',
  searchPlaceholder: 'Search restaurants, zones…',
  statsNudge: 'Bookmark places you want to try, and log visits to build your guide.',
  sections: {
    featured: 'Top rated',
    explore: 'Explore',
    wantToTry: 'Want to try',
    recent: 'Recent visits',
  },
  stats: { visited: 'Visited', bookmarked: 'Saved', toTry: 'To try' },
  wantToTryEmpty: {
    title: 'Nothing saved yet',
    body: 'Bookmark places you want to try and they’ll show up here.',
    cta: 'Browse restaurants',
  },
  recentEmpty: {
    title: 'No visits logged',
    body: 'Mark a restaurant visited to start your history.',
    cta: 'Browse restaurants',
  },
} as const;
