import { View, Text, ScrollView, Linking, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import {
  useRestaurant,
  useRatings,
  useConsensus,
  useDishes,
  useWines,
  useVisits,
} from '@/hooks/useRestaurant';
import { getDb } from '@/db/client';
import { setVisited } from '@/db/repo';
import { queryClient } from '@/query/client';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PriceBadge } from '@/components/PriceBadge';
import { Button, RatingBar, type SourceScores } from '@/components/ui';
import { TileHero } from '@/components/Azulejo';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToggleBookmark } from '@/hooks/useToggleBookmark';
import { selectionFeedback } from '@/utils/haptics';

export default function OverviewTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const router = useRouter();
  const c = useThemeColors();
  const { data: r } = useRestaurant(id);
  const { data: ratings = [] } = useRatings(id);
  const { data: consensus } = useConsensus(id);
  const { data: dishes = [] } = useDishes(id);
  const { data: wines = [] } = useWines(id);
  const { data: visits = [] } = useVisits(id);
  const toggleBookmark = useToggleBookmark();

  if (!r) {
    return (
      <View className="flex-1 items-center justify-center bg-base dark:bg-base-dark">
        <Text className="font-sans text-muted dark:text-muted-dark">Loading…</Text>
      </View>
    );
  }

  const scores: SourceScores = {};
  for (const rt of ratings) {
    if (rt.score != null) scores[rt.source] = rt.score;
  }

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
    queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    queryClient.invalidateQueries({ queryKey: ['catalog'] });
  };

  const openMaps = () => {
    const q =
      r.latitude != null && r.longitude != null
        ? `${r.latitude},${r.longitude}`
        : encodeURIComponent(r.address ?? r.name);
    Linking.openURL(`https://maps.apple.com/?q=${q}`);
  };

  const goTab = (tab: 'dishes' | 'wine' | 'my-notes') =>
    router.navigate({ pathname: `/restaurant/[id]/${tab}`, params: { id } });

  const bookmarked = r.bookmarked === 1;
  const visited = r.visited === 1;

  return (
    <ScrollView className="flex-1 bg-base dark:bg-base-dark">
      {/* Tile banner */}
      <TileHero id={r.id} category={r.category} height={96} />

      <View className="px-4 py-3">
        <Text
          maxFontSizeMultiplier={1.3}
          className="font-serif-bold text-2xl text-ink dark:text-ink-dark"
        >
          {r.name}
        </Text>
        {r.zone ? (
          <Text className="mt-0.5 font-sans text-muted dark:text-muted-dark">{r.zone}</Text>
        ) : null}

        <View className="mt-2 flex-row items-center gap-2">
          <CategoryBadge category={r.category} />
          {r.price_range ? <PriceBadge price={r.price_range} /> : null}
        </View>

        {/* Consensus headline — gold-accented card */}
        {consensus ? (
          <View className="mt-5 flex-row items-stretch overflow-hidden rounded-card border border-black/5 bg-surface dark:border-white/10 dark:bg-surface-dark">
            <View className="w-1.5 bg-nata" />
            <View className="flex-1 p-4">
              <View className="flex-row items-end gap-2">
                <Text
                  maxFontSizeMultiplier={1.3}
                  className="font-serif-black text-5xl text-ink dark:text-ink-dark"
                >
                  {consensus.score.toFixed(1)}
                </Text>
                <Text className="pb-2 font-sans text-xs text-muted dark:text-muted-dark">
                  ± {consensus.band.toFixed(1)} · {consensus.sourceCount} source
                  {consensus.sourceCount === 1 ? '' : 's'}
                  {consensus.totalReviews > 0
                    ? ` · ~${consensus.totalReviews.toLocaleString()} reviews`
                    : ''}
                </Text>
              </View>
              <View className="mt-3">
                <RatingBar scores={scores} />
              </View>
            </View>
          </View>
        ) : (
          <View className="mt-5">
            <RatingBar scores={scores} />
          </View>
        )}

        {/* Quick actions — bookmark + visited without leaving Overview */}
        <View className="mt-4 flex-row gap-3">
          <Button
            label={bookmarked ? 'Bookmarked' : 'Bookmark'}
            variant={bookmarked ? 'primary' : 'ghost'}
            leftIconName={bookmarked ? 'bookmark' : 'bookmark-outline'}
            className="flex-1"
            onPress={() => toggleBookmark(r)}
          />
          <Button
            label={visited ? 'Visited' : 'Mark visited'}
            variant={visited ? 'secondary' : 'ghost'}
            leftIconName={visited ? 'checkmark-circle' : 'checkmark-circle-outline'}
            className="flex-1"
            onPress={() => {
              selectionFeedback();
              setVisited(getDb(), id, !visited);
              refresh();
            }}
          />
        </View>

        {/* At-a-glance counts linking to the other tabs */}
        <View className="mt-4 flex-row gap-2">
          {(
            [
              { tab: 'dishes', label: 'Dishes', n: dishes.length, icon: 'fast-food-outline' },
              { tab: 'wine', label: 'Wine', n: wines.length, icon: 'wine-outline' },
              { tab: 'my-notes', label: 'Visits', n: visits.length, icon: 'create-outline' },
            ] as const
          ).map((x) => (
            <Pressable
              key={x.tab}
              onPress={() => goTab(x.tab)}
              accessibilityRole="button"
              accessibilityLabel={`${x.label}, ${x.n}`}
              className="flex-1 items-center rounded-card border border-black/5 bg-surface py-3 dark:border-white/10 dark:bg-surface-dark"
            >
              <Ionicons name={x.icon} size={18} color={c.accent} />
              <Text className="mt-1 font-serif-semibold text-lg text-ink dark:text-ink-dark">
                {x.n}
              </Text>
              <Text className="font-sans text-xs text-muted dark:text-muted-dark">{x.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Links */}
        <View className="mt-5 gap-2">
          {r.address ? (
            <Button label="Open in Maps" variant="ghost" leftIconName="map-outline" onPress={openMaps} />
          ) : null}
          {r.website ? (
            <Button
              label="Website"
              variant="ghost"
              leftIconName="globe-outline"
              onPress={() => WebBrowser.openBrowserAsync(r.website!)}
            />
          ) : null}
        </View>
        {r.address ? (
          <Text className="mt-2 font-sans text-xs text-muted dark:text-muted-dark">{r.address}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
