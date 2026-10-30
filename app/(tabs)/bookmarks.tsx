import { useState } from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { RestaurantCard } from '@/components/RestaurantCard';
import { ScreenContainer, Chip, EmptyState, ErrorState, SkeletonList } from '@/components/ui';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { bookmarkSubfilter, type BookmarkMode } from '@/db/repo';

const MODES: { key: BookmarkMode; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'want-to-try', label: 'Want to Try' },
  { key: 'visited-loved', label: 'Visited & Loved' },
];

export default function BookmarksScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<BookmarkMode>('all');
  const toggleBookmark = useToggleBookmark();
  const { data: bookmarked = [], isLoading, isError, refetch } = useRestaurants({
    bookmarkedOnly: true,
  });
  const items = bookmarked.filter((r) => bookmarkSubfilter(r, mode));

  return (
    <ScreenContainer padded={false}>
      <View className="flex-row flex-wrap gap-2 px-4 pt-2">
        {MODES.map((m) => (
          <Chip key={m.key} label={m.label} active={mode === m.key} onPress={() => setMode(m.key)} />
        ))}
      </View>

      {isLoading ? (
        <View className="mt-3 px-4">
          <SkeletonList count={5} />
        </View>
      ) : isError ? (
        <ErrorState message="Couldn't load bookmarks." onRetry={() => refetch()} />
      ) : (
        <FlatList
          className="mt-3 px-4"
          data={items}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <RestaurantCard
              item={item}
              onPress={() =>
                router.push({ pathname: '/restaurant/[id]/overview', params: { id: item.id } })
              }
              onToggleBookmark={() => toggleBookmark(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title="No bookmarks here yet"
              body="Bookmark restaurants you want to try and they’ll appear here."
            />
          }
        />
      )}
    </ScreenContainer>
  );
}
