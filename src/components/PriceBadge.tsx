import { View, Text } from 'react-native';
import type { PriceRange } from '@/domain';

// Price range chip — outline with accent text (DESIGN_PLAN §4). Themed via
// tailwind so it adapts to light/dark.
export function PriceBadge({ price }: { price: PriceRange }) {
  return (
    <View
      testID="price-badge"
      className="self-start rounded-badge border border-black/15 px-2 py-0.5 dark:border-white/20"
    >
      <Text className="font-sans-semibold text-xs text-accent dark:text-accent-dark">{price}</Text>
    </View>
  );
}
