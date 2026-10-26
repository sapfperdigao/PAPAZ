import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RestaurantListItem } from '@/db/repo';
import { CategoryBadge } from './CategoryBadge';
import { PriceBadge } from './PriceBadge';
import { formatDistance } from '@/utils/formatDistance';
import { tokens } from '@/theme/tokens';

export function RestaurantCard({
  item,
  onPress,
}: {
  item: RestaurantListItem;
  onPress?: () => void;
}) {
  const stars = item.personalRating;
  return (
    <Pressable
      testID="restaurant-card"
      onPress={onPress}
      className="mb-2 rounded-xl bg-white p-3 dark:bg-neutral-900"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {item.name}
        </Text>
        {item.consensus != null ? (
          <View
            className="ml-2 rounded-md px-1.5 py-0.5"
            style={{ backgroundColor: tokens.color.accent }}
          >
            <Text className="text-xs font-bold text-black">{item.consensus.toFixed(1)}</Text>
          </View>
        ) : null}
        {item.bookmarked === 1 ? (
          <Ionicons name="bookmark" size={16} color={tokens.color.danger} style={{ marginLeft: 6 }} />
        ) : null}
      </View>

      {item.zone ? (
        <Text className="mt-0.5 text-xs text-neutral-500">{item.zone}</Text>
      ) : null}

      <View className="mt-2 flex-row items-center gap-2">
        <CategoryBadge category={item.category} />
        {item.price_range ? <PriceBadge price={item.price_range} /> : null}

        <View testID="card-stars" className="flex-row items-center" style={{ opacity: item.visited ? 1 : 0.4 }}>
          <Ionicons name="star" size={13} color={tokens.color.accent} />
          <Text className="ml-0.5 text-xs text-neutral-500">
            {stars != null ? stars.toFixed(1) : '—'}
          </Text>
        </View>

        {item.visited === 1 ? (
          <Ionicons name="checkmark-circle" size={14} color={tokens.category.marisqueira} />
        ) : null}

        {item.distanceKm != null ? (
          <Text className="ml-auto text-xs text-neutral-500">
            {formatDistance(item.distanceKm)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
