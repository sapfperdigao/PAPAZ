import { View, Text } from 'react-native';
import { cn } from '@/utils/cn';

// Consensus score chip — a neutral, inverted ink pill (DESIGN_PLAN §2.1): dark
// chip with light text in light mode, light chip with dark text in dark mode.
// Deliberately NOT the accent color, so the score never clashes with a category
// badge painted on the same card. Mode-aware via ink/base tailwind pairs.
export function ConsensusBadge({
  score,
  className,
  testID = 'consensus-badge',
}: {
  score: number;
  className?: string;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      accessibilityLabel={`Consensus score ${score.toFixed(1)} out of 10`}
      className={cn(
        'self-start rounded-badge bg-ink px-1.5 py-0.5 dark:bg-ink-dark',
        className,
      )}
    >
      <Text className="font-sans-bold text-xs text-base dark:text-base-dark">
        {score.toFixed(1)}
      </Text>
    </View>
  );
}
