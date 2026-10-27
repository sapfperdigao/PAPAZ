import { useRouter } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer, Chip, Button, SectionHeader } from '@/components/ui';
import { useUiStore } from '@/store/ui';
import type { VisitedFilter } from '@/db/repo';
import type { Category, PriceRange } from '@/domain';

const CATEGORIES: Category[] = ['tasca', 'cervejaria', 'marisqueira', 'other'];
const PRICES: PriceRange[] = ['€', '€€', '€€€', '€€€€'];
const VISITED: { key: VisitedFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'visited', label: 'Visited' },
  { key: 'unvisited', label: 'Unvisited' },
];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Filter sheet (DESIGN_PLAN §6.2) — the category/price/visited/bookmarked rows
// moved out of My List so the list breathes. Reads/writes the shared UI store,
// so changes apply live to the list behind the sheet.
export default function FiltersScreen() {
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useUiStore();

  const toggleCategory = (c: Category) =>
    setFilters({
      categories: filters.categories.includes(c)
        ? filters.categories.filter((x) => x !== c)
        : [...filters.categories, c],
    });
  const togglePrice = (p: PriceRange) =>
    setFilters({
      prices: filters.prices.includes(p)
        ? filters.prices.filter((x) => x !== p)
        : [...filters.prices, p],
    });

  return (
    <ScreenContainer edges={['top']}>
      <View className="flex-row items-center justify-between py-3">
        <Text className="font-serif-semibold text-xl text-ink dark:text-ink-dark">Filters</Text>
        <Button label="Done" variant="ghost" size="sm" onPress={() => router.back()} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-2">
          <SectionHeader title="Category" />
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={cap(c)}
                active={filters.categories.includes(c)}
                onPress={() => toggleCategory(c)}
              />
            ))}
          </View>
        </View>

        <View className="mt-5">
          <SectionHeader title="Price" />
          <View className="flex-row flex-wrap gap-2">
            {PRICES.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.prices.includes(p)}
                onPress={() => togglePrice(p)}
              />
            ))}
          </View>
        </View>

        <View className="mt-5">
          <SectionHeader title="Visited" />
          <View className="flex-row flex-wrap gap-2">
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

        <View className="mt-5">
          <SectionHeader title="Saved" />
          <Chip
            label="Bookmarked only"
            active={filters.bookmarkedOnly}
            onPress={() => setFilters({ bookmarkedOnly: !filters.bookmarkedOnly })}
          />
        </View>

        <View className="mt-8">
          <Button label="Reset filters" variant="ghost" onPress={resetFilters} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
