import { useQuery } from '@tanstack/react-query';
import { getDb } from '@/db/client';
import { listRestaurants, type ListOpts, type RestaurantListItem } from '@/db/repo';
import { useUiStore } from '@/store/ui';

// Reads the list through the repository, keyed on the active sort + filters so
// any mutation that invalidates ['restaurants'] refetches. `extra` lets a
// screen inject options the store doesn't hold (e.g. a GPS origin, or forcing
// bookmarkedOnly on the Bookmarks tab).
export function useRestaurants(extra?: Partial<ListOpts>) {
  const sort = useUiStore((s) => s.sort);
  const filters = useUiStore((s) => s.filters);
  return useQuery<RestaurantListItem[]>({
    queryKey: ['restaurants', sort, filters, extra],
    queryFn: async () => listRestaurants(getDb(), { sort, ...filters, ...extra }),
  });
}
