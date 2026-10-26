import { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useRestaurants } from '@/hooks/useRestaurants';
import { bookmarkSubfilter, type BookmarkMode } from '@/db/repo';

const MODES: { key: BookmarkMode; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'want-to-try', label: 'Want to Try' },
  { key: 'visited-loved', label: 'Visited & Loved' },
];

export default function BookmarksScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<BookmarkMode>('all');
  const { data: bookmarked = [] } = useRestaurants({ bookmarkedOnly: true });
  const items = bookmarked.filter((r) => bookmarkSubfilter(r, mode));

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <View className="flex-row flex-wrap gap-2 px-4 pt-2">
        {MODES.map((m) => (
          <Pressable
            key={m.key}
            onPress={() => setMode(m.key)}
            className={`rounded-full border px-3 py-1 ${
              mode === m.key
                ? 'border-amber-500 bg-amber-500'
                : 'border-neutral-300 dark:border-neutral-700'
            }`}
          >
            <Text
              className={
                mode === m.key ? 'text-xs font-semibold text-black' : 'text-xs text-neutral-500'
              }
            >
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        className="mt-3 px-4"
        data={items}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <RestaurantCard item={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
        )}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-neutral-500">No bookmarks here yet.</Text>
        }
      />
    </SafeAreaView>
  );
}
