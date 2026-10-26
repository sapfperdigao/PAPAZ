import { View, Text, Pressable, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useRestaurant, useRatings } from '@/hooks/useRestaurant';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PriceBadge } from '@/components/PriceBadge';
import { RatingBar, type SourceScores } from '@/components/RatingBar';

export default function OverviewTab() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = String(params.id);
  const { data: r } = useRestaurant(id);
  const { data: ratings = [] } = useRatings(id);

  if (!r) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Text className="text-neutral-500">Loading…</Text>
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
    <ScrollView className="flex-1 bg-neutral-50 px-4 py-3 dark:bg-neutral-950">
      <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{r.name}</Text>
      {r.zone ? <Text className="text-neutral-500">{r.zone}</Text> : null}

      <View className="mt-2 flex-row items-center gap-2">
        <CategoryBadge category={r.category} />
        {r.price_range ? <PriceBadge price={r.price_range} /> : null}
      </View>

      {r.address ? (
        <Pressable onPress={openMaps} className="mt-4">
          <Text className="text-amber-600">{r.address}</Text>
          <Text className="mt-0.5 text-xs text-amber-600">Open in Maps →</Text>
        </Pressable>
      ) : null}

      {r.website ? (
        <Pressable onPress={() => WebBrowser.openBrowserAsync(r.website!)} className="mt-3">
          <Text className="text-amber-600">Website →</Text>
        </Pressable>
      ) : null}

      <Text className="mb-2 mt-6 text-xs font-semibold text-neutral-500">Consensus</Text>
      <RatingBar scores={scores} />
    </ScrollView>
  );
}
