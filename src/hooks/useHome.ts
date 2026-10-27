import { useQuery } from '@tanstack/react-query';
import { getDb } from '@/db/client';
import {
  listRestaurants,
  listRecentVisits,
  type RestaurantListItem,
  type RecentVisit,
} from '@/db/repo';

// Home reads the full catalogue independent of the List screen's active filters
// (DESIGN_PLAN §6.1), consensus-sorted so the featured carousel and derived
// stats always have data on a fresh install.
export function useCatalog() {
  return useQuery<RestaurantListItem[]>({
    queryKey: ['catalog'],
    queryFn: async () => listRestaurants(getDb(), { sort: 'consensus' }),
  });
}

export function useRecentVisits(limit = 5) {
  return useQuery<RecentVisit[]>({
    queryKey: ['recent-visits', limit],
    queryFn: async () => listRecentVisits(getDb(), limit),
  });
}

export interface HomeStats {
  visited: number;
  bookmarked: number;
  toTry: number;
}

// Engagement counts derived from the catalogue — no extra query, and zero on a
// fresh install (Home shows an onboarding nudge for that case, §6.1).
export function deriveStats(items: RestaurantListItem[]): HomeStats {
  let visited = 0;
  let bookmarked = 0;
  let toTry = 0;
  for (const r of items) {
    if (r.visited === 1) visited++;
    if (r.bookmarked === 1) {
      bookmarked++;
      if (r.visited !== 1) toTry++;
    }
  }
  return { visited, bookmarked, toTry };
}
