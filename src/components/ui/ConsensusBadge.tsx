import { View, Text } from 'react-native';
import { cn } from '@/utils/cn';

// Consensus score chip — the pastel-de-nata gold pill with navy text (spec
// 2026-10-30-papaz-azulejo-redesign): the brand's warm spark against the cobalt
// world, and distinct from any category badge on the same card. Gold in both
// modes; navy text clears AA (9.5:1).
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
      className={cn('self-start rounded-badge bg-nata px-1.5 py-0.5', className)}
    >
      <Text className="font-sans-bold text-xs text-ink">{score.toFixed(1)}</Text>
    </View>
  );
}
