import { useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RestaurantCard } from '@/components/RestaurantCard';
import { ScreenContainer, Chip, EmptyState, ErrorState, SkeletonList } from '@/components/ui';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useUiStore } from '@/store/ui';
import { useLocation } from '@/hooks/useLocation';
import { tokens } from '@/theme/tokens';
import type { SortKey } from '@/db/repo';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'consensus', label: 'Consensus' },
  { key: 'distance', label: 'Distance' },
  { key: 'rating', label: 'My rating' },
  { key: 'name', label: 'Name' },
  { key: 'zone', label: 'Zone' },
];

export default function ListScreen() {
  const router = useRouter();
  const { sort, filters, setSort, setSearch } = useUiStore();
  const location = useLocation();

  const origin = sort === 'distance' && location.coords ? location.coords : undefined;
  const { data: items = [], isLoading, isError, refetch } = useRestaurants(
    origin ? { origin } : undefined,
  );

  useEffect(() => {
    if (sort === 'distance' && location.status === 'undetermined') {
      void location.request();
    }
  }, [sort, location.status, location.request]);

  const activeFilters =
    filters.categories.length +
    filters.prices.length +
    (filters.visited !== 'all' ? 1 : 0) +
    (filters.bookmarkedOnly ? 1 : 0);

  return (
    <ScreenContainer padded={false}>
      <View className="px-4 pt-2">
        {/* Search + filter trigger */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center rounded-pill border border-black/10 bg-surface px-4 dark:border-white/10 dark:bg-surface-dark">
            <Ionicons name="search" size={18} color={tokens.color.textSecondary.light} />
            <TextInput
              placeholder="Search name, zone, address"
              defaultValue={filters.search}
              onChangeText={setSearch}
              className="ml-2 flex-1 py-2.5 font-sans text-ink dark:text-ink-dark"
              placeholderTextColor={tokens.color.textSecondary.light}
              accessibilityLabel="Search restaurants"
            />
          </View>
          <Pressable
            onPress={() => router.push('/filters')}
            accessibilityRole="button"
            accessibilityLabel={`Filters${activeFilters ? `, ${activeFilters} active` : ''}`}
            hitSlop={8}
            className="h-11 w-11 items-center justify-center rounded-pill border border-black/10 bg-surface dark:border-white/10 dark:bg-surface-dark"
          >
            <Ionicons name="options-outline" size={20} color={tokens.color.accent} />
            {activeFilters ? (
              <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-pill bg-accent dark:bg-accent-dark">
                <Text className="font-sans-bold text-[10px] text-accent-fg dark:text-accent-fg-dark">
                  {activeFilters}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* Sort row */}
        <View className="mt-3 flex-row flex-wrap gap-2">
          {SORTS.map((s) => (
            <Chip key={s.key} label={s.label} active={sort === s.key} onPress={() => setSort(s.key)} />
          ))}
        </View>
      </View>

      {isLoading ? (
        <View className="mt-3 px-4">
          <SkeletonList count={6} />
        </View>
      ) : isError ? (
        <ErrorState message="Couldn't load restaurants." onRetry={() => refetch()} />
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
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title="No restaurants match"
              body="Try clearing a filter or searching for something else."
            />
          }
        />
      )}
    </ScreenContainer>
  );
}
