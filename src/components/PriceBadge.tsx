import { View, Text } from 'react-native';
import type { PriceRange } from '@/domain';
import { tokens } from '@/theme/tokens';

export function PriceBadge({ price }: { price: PriceRange }) {
  return (
    <View
      testID="price-badge"
      className="self-start rounded-md border px-2 py-0.5"
      style={{ borderColor: tokens.color.textSecondary.dark }}
    >
      <Text className="text-xs font-semibold" style={{ color: tokens.color.accent }}>
        {price}
      </Text>
    </View>
  );
}
