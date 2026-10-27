import { View, Text, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useRestaurant, useRatings, useConsensus } from '@/hooks/useRestaurant';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PriceBadge } from '@/components/PriceBadge';
import { Button, RatingBar, type SourceScores } from '@/components/ui';

export default function OverviewTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: r } = useRestaurant(id);
  const { data: ratings = [] } = useRatings(id);
  const { data: consensus } = useConsensus(id);

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

  const openMaps = () => {
    const q =
      r.latitude != null && r.longitude != null
        ? `${r.latitude},${r.longitude}`
        : encodeURIComponent(r.address ?? r.name);
    Linking.openURL(`https://maps.apple.com/?q=${q}`);
  };

  return (
    <ScrollView className="flex-1 bg-base px-4 py-3 dark:bg-base-dark">
      {/* Header */}
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

      {/* Consensus headline */}
      {consensus ? (
        <View className="mt-5 rounded-card border border-black/5 bg-surface p-4 dark:border-white/10 dark:bg-surface-dark">
          <Text className="font-sans-semibold text-xs uppercase tracking-wide text-muted dark:text-muted-dark">
            Consensus
          </Text>
          <View className="mt-1 flex-row items-end gap-2">
            <Text
              maxFontSizeMultiplier={1.3}
              className="font-serif-bold text-4xl text-ink dark:text-ink-dark"
            >
              {consensus.score.toFixed(1)}
            </Text>
            <Text className="pb-1.5 font-sans text-xs text-muted dark:text-muted-dark">
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
      ) : (
        <View className="mt-5">
          <RatingBar scores={scores} />
        </View>
      )}

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
    </ScrollView>
  );
}
