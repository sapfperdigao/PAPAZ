import { useState } from 'react';
import { View, Text, TextInput, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScreenContainer,
  SectionHeader,
  Chip,
  Stat,
  Card,
  ConsensusBadge,
  Badge,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonList,
} from '@/components/ui';
import { RestaurantCard } from '@/components/RestaurantCard';
import { useCatalog, useRecentVisits, deriveStats } from '@/hooks/useHome';
import { useUiStore } from '@/store/ui';
import { greeting, COPY } from '@/utils/copy';
import { tokens } from '@/theme/tokens';
import type { Category, PriceRange } from '@/domain';
import type { RestaurantListItem, RecentVisit } from '@/db/repo';

const CATEGORIES: Category[] = ['tasca', 'cervejaria', 'marisqueira', 'other'];
const PRICES: PriceRange[] = ['€', '€€', '€€€', '€€€€'];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function FeaturedCard({ item, onPress }: { item: RestaurantListItem; onPress: () => void }) {
  return (
    <Card onPress={onPress} accessibilityLabel={item.name} className="w-44">
      <View className="flex-row items-start justify-between">
        <Text
          numberOfLines={2}
          className="flex-1 font-serif-semibold text-base text-ink dark:text-ink-dark"
        >
          {item.name}
        </Text>
        {item.consensus != null ? <ConsensusBadge score={item.consensus} className="ml-2" /> : null}
      </View>
      {item.zone ? (
        <Text numberOfLines={1} className="mt-1 font-sans text-xs text-muted dark:text-muted-dark">
          {item.zone}
        </Text>
      ) : null}
      <View className="mt-2">
        <Badge label={cap(item.category)} color={tokens.category[item.category]} />
      </View>
    </Card>
  );
}

function RecentVisitRow({ visit, onPress }: { visit: RecentVisit; onPress: () => void }) {
  const date = new Date(visit.visitedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  return (
    <Card onPress={onPress} accessibilityLabel={visit.restaurantName} className="mb-2">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 font-serif-semibold text-base text-ink dark:text-ink-dark">
          {visit.restaurantName}
        </Text>
        <Text className="ml-2 font-sans text-xs text-muted dark:text-muted-dark">{date}</Text>
      </View>
      {visit.personalNotes ? (
        <Text numberOfLines={2} className="mt-1 font-sans text-sm text-muted dark:text-muted-dark">
          {visit.personalNotes}
        </Text>
      ) : null}
    </Card>
  );
}

// Home / Discover (DESIGN_PLAN §6.1). Two bands: an always-populated band built
// from the seeded catalogue (hero + search, featured carousel, quick filters)
// so Home is never blank on a fresh install; and an engagement band (stat strip,
// want-to-try, recent visits) that renders onboarding nudges / EmptyState CTAs
// when there's no user data yet. Each data module owns its four states (§4).
export default function HomeScreen() {
  const router = useRouter();
  const { setFilters, setSearch, resetFilters, setSort } = useUiStore();
  const [q, setQ] = useState('');
  const catalog = useCatalog();
  const recent = useRecentVisits(5);

  const items = catalog.data ?? [];
  const stats = deriveStats(items);
  const featured = items.filter((r) => r.consensus != null).slice(0, 10);
  const wantToTry = items.filter((r) => r.bookmarked === 1);
  const hasEngagement = stats.visited + stats.bookmarked + stats.toTry > 0;

  const goList = () => router.navigate('/list');
  const openRestaurant = (id: string) =>
    router.push({ pathname: '/restaurant/[id]/overview', params: { id } });
  const submitSearch = () => {
    setSearch(q);
    goList();
  };
  const openCategory = (c: Category) => {
    resetFilters();
    setFilters({ categories: [c] });
    goList();
  };
  const openPrice = (p: PriceRange) => {
    resetFilters();
    setFilters({ prices: [p] });
    goList();
  };

  return (
    <ScreenContainer padded={false}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-10">
          {/* Hero */}
          <View className="pt-2">
            <Text className="font-sans text-sm text-muted dark:text-muted-dark">{greeting()}</Text>
            <Text className="font-serif-bold text-3xl text-ink dark:text-ink-dark">
              {COPY.tagline}
            </Text>
            <View className="mt-3 flex-row items-center rounded-pill border border-black/10 bg-surface px-4 dark:border-white/10 dark:bg-surface-dark">
              <Ionicons name="search" size={18} color={tokens.color.textSecondary.light} />
              <TextInput
                value={q}
                onChangeText={setQ}
                onSubmitEditing={submitSearch}
                returnKeyType="search"
                placeholder={COPY.searchPlaceholder}
                placeholderTextColor={tokens.color.textSecondary.light}
                accessibilityLabel="Search restaurants"
                className="ml-2 flex-1 py-3 font-sans text-ink dark:text-ink-dark"
              />
            </View>
          </View>

          {/* Stat strip — onboarding nudge when there's no engagement yet */}
          <View className="mt-5 rounded-card border border-black/5 bg-surface py-4 dark:border-white/10 dark:bg-surface-dark">
            {hasEngagement ? (
              <View className="flex-row justify-around">
                <Stat value={stats.visited} label={COPY.stats.visited} />
                <Stat value={stats.bookmarked} label={COPY.stats.bookmarked} />
                <Stat value={stats.toTry} label={COPY.stats.toTry} />
              </View>
            ) : (
              <Text className="px-5 text-center font-sans text-sm text-muted dark:text-muted-dark">
                {COPY.statsNudge}
              </Text>
            )}
          </View>

          {/* Featured carousel — always populated from the catalogue */}
          <View className="mt-6">
            <SectionHeader
              title={COPY.sections.featured}
              actionLabel="See all"
              onAction={() => {
                resetFilters();
                setSort('consensus');
                goList();
              }}
            />
            {catalog.isLoading ? (
              <Skeleton className="h-36 w-full" />
            ) : catalog.isError ? (
              <ErrorState onRetry={() => catalog.refetch()} />
            ) : (
              <FlatList
                horizontal
                data={featured}
                keyExtractor={(r) => r.id}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-3" />}
                renderItem={({ item }) => (
                  <FeaturedCard item={item} onPress={() => openRestaurant(item.id)} />
                )}
              />
            )}
          </View>

          {/* Explore — quick-filter chips deep-link into a pre-filtered List */}
          <View className="mt-6">
            <SectionHeader title={COPY.sections.explore} />
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c} label={cap(c)} active={false} onPress={() => openCategory(c)} />
              ))}
              {PRICES.map((p) => (
                <Chip key={p} label={p} active={false} onPress={() => openPrice(p)} />
              ))}
            </View>
          </View>

          {/* Want to try — bookmarked, or an onboarding EmptyState */}
          <View className="mt-6">
            <SectionHeader
              title={COPY.sections.wantToTry}
              actionLabel={wantToTry.length ? 'See all' : undefined}
              onAction={
                wantToTry.length
                  ? () => {
                      resetFilters();
                      setFilters({ bookmarkedOnly: true });
                      goList();
                    }
                  : undefined
              }
            />
            {catalog.isLoading ? (
              <SkeletonList count={2} />
            ) : wantToTry.length === 0 ? (
              <EmptyState
                icon="bookmark-outline"
                title={COPY.wantToTryEmpty.title}
                body={COPY.wantToTryEmpty.body}
                actionLabel={COPY.wantToTryEmpty.cta}
                onAction={goList}
              />
            ) : (
              wantToTry
                .slice(0, 3)
                .map((r) => (
                  <RestaurantCard key={r.id} item={r} onPress={() => openRestaurant(r.id)} />
                ))
            )}
          </View>

          {/* Recent visits — uses listRecentVisits; EmptyState when none */}
          <View className="mt-6">
            <SectionHeader title={COPY.sections.recent} />
            {recent.isLoading ? (
              <SkeletonList count={2} />
            ) : recent.isError ? (
              <ErrorState onRetry={() => recent.refetch()} />
            ) : (recent.data?.length ?? 0) === 0 ? (
              <EmptyState
                icon="time-outline"
                title={COPY.recentEmpty.title}
                body={COPY.recentEmpty.body}
                actionLabel={COPY.recentEmpty.cta}
                onAction={goList}
              />
            ) : (
              recent.data!.map((v) => (
                <RecentVisitRow key={v.id} visit={v} onPress={() => openRestaurant(v.restaurantId)} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
