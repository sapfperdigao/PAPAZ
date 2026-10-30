import { getDb } from '@/db/client';
import { setBookmark, type RestaurantListItem } from '@/db/repo';
import { queryClient } from '@/query/client';
import { selectionFeedback } from '@/utils/haptics';

// Toggle a restaurant's bookmark from a list/card, then invalidate the read
// queries so every surface reflects it. Shared by List, Bookmarks, and Home.
export function useToggleBookmark() {
  return (item: Pick<RestaurantListItem, 'id' | 'bookmarked'>) => {
    selectionFeedback();
    setBookmark(getDb(), item.id, item.bookmarked !== 1);
    queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    queryClient.invalidateQueries({ queryKey: ['catalog'] });
    queryClient.invalidateQueries({ queryKey: ['restaurant', item.id] });
  };
}
