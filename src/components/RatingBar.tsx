import { View, Text } from 'react-native';
import type { RatingSource } from '@/domain';
import { tokens } from '@/theme/tokens';

export type SourceScores = Partial<Record<RatingSource, number>>;

const LABELS: Record<RatingSource, string> = {
  google: 'Google',
  thefork: 'TheFork',
  tripadvisor: 'TripAdvisor',
  reddit: 'Reddit',
  personal: 'Personal',
};

const ORDER: RatingSource[] = ['google', 'thefork', 'tripadvisor', 'reddit', 'personal'];

// Consensus display. Scores are normalized 0–10. Only present sources render;
// with no sources it shows an empty state (never divides by zero — Review
// Focus #4).
export function RatingBar({ scores }: { scores: SourceScores }) {
  const entries = ORDER.filter((s) => scores[s] != null).map(
    (s) => [s, scores[s] as number] as const,
  );

  if (entries.length === 0) {
    return (
      <Text testID="rating-empty" className="text-xs text-neutral-500">
        No ratings yet
      </Text>
    );
  }

  return (
    <View testID="rating-bar" className="gap-2">
      {entries.map(([source, value]) => {
        const pct = Math.max(0, Math.min(100, (value / 10) * 100));
        return (
          <View key={source} className="flex-row items-center gap-2">
            <Text className="w-20 text-xs text-neutral-500">{LABELS[source]}</Text>
            <View className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <View
                className="h-2 rounded-full"
                style={{ width: `${pct}%`, backgroundColor: tokens.color.accent }}
              />
            </View>
            <Text className="w-8 text-right text-xs text-neutral-500">{value.toFixed(1)}</Text>
          </View>
        );
      })}
    </View>
  );
}
