import { View, Text } from 'react-native';
import type { Category } from '@/domain';
import { tokens } from '@/theme/tokens';

const LABELS: Record<Category, string> = {
  tasca: 'Tasca',
  cervejaria: 'Cervejaria',
  marisqueira: 'Marisqueira',
  other: 'Other',
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <View
      testID="category-badge"
      className="self-start rounded-md px-2 py-0.5"
      style={{ backgroundColor: tokens.category[category] }}
    >
      <Text className="text-xs font-semibold" style={{ color: '#111111' }}>
        {LABELS[category]}
      </Text>
    </View>
  );
}
