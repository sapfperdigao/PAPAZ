import { useEffect } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Chip } from '@/components/ui';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useUiStore } from '@/store/ui';
import { useLocation } from '@/hooks/useLocation';
import type { SortKey, VisitedFilter } from '@/db/repo';
import type { Category, PriceRange } from '@/domain';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'consensus', label: 'Consensus' },
  { key: 'distance', label: 'Distance' },
  { key: 'rating', label: 'My rating' },
  { key: 'name', label: 'Name' },
  { key: 'zone', label: 'Zone' },
];

const CATEGORIES: Category[] = ['tasca', 'cervejaria', 'marisqueira', 'other'];
const PRICES: PriceRange[] = ['€', '€€', '€€€', '€€€€'];
const VISITED: { key: VisitedFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'visited', label: 'Visited' },
  { key: 'unvisited', label: 'Unvisited' },
];

export default function ListScreen() {
  const router = useRouter();
  const { sort, filters, setSort, setFilters, setSearch } = useUiStore();
  const location = useLocation();

  // Pass a GPS origin only when sorting by distance and coords are available.
  const origin = sort === 'distance' && location.coords ? location.coords : undefined;
  const { data: items = [] } = useRestaurants(origin ? { origin } : undefined);

  // Request location the first time the user selects distance sort.
  useEffect(() => {
    if (sort === 'distance' && location.status === 'undetermined') {
      void location.request();
    }
  }, [sort, location.status, location.request]);

  const toggleCategory = (c: Category) => {
    const next = filters.categories.includes(c)
      ? filters.categories.filter((x) => x !== c)
      : [...filters.categories, c];
    setFilters({ categories: next });
  };

  const togglePrice = (p: PriceRange) => {
    const next = filters.prices.includes(p)
      ? filters.prices.filter((x) => x !== p)
      : [...filters.prices, p];
    setFilters({ prices: next });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <View className="px-4 pt-2">
        <TextInput
          placeholder="Search name, zone, address"
          defaultValue={filters.search}
          onChangeText={setSearch}
          className="rounded-xl bg-white px-3 py-2 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
          placeholderTextColor="#9A9A9A"
        />

        <View className="mt-3 flex-row flex-wrap gap-2">
          {SORTS.map((s) => (
            <Chip key={s.key} label={s.label} active={sort === s.key} onPress={() => setSort(s.key)} />
          ))}
        </View>

        <View className="mt-2 flex-row flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c[0].toUpperCase() + c.slice(1)}
              active={filters.categories.includes(c)}
              onPress={() => toggleCategory(c)}
            />
          ))}
          <Chip
            label="Bookmarked"
            active={filters.bookmarkedOnly}
            onPress={() => setFilters({ bookmarkedOnly: !filters.bookmarkedOnly })}
          />
        </View>

        <View className="mt-2 flex-row flex-wrap gap-2">
          {PRICES.map((p) => (
            <Chip
              key={p}
              label={p}
              active={filters.prices.includes(p)}
              onPress={() => togglePrice(p)}
            />
          ))}
        </View>

        <View className="mt-2 flex-row flex-wrap gap-2">
          {VISITED.map((v) => (
            <Chip
              key={v.key}
              label={v.label}
              active={filters.visited === v.key}
              onPress={() => setFilters({ visited: v.key })}
            />
          ))}
        </View>
      </View>

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
          <Text className="mt-10 text-center text-neutral-500">No restaurants yet.</Text>
        }
      />
    </SafeAreaView>
  );
}
