import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RestaurantListItem } from '@/db/repo';
import { CategoryBadge } from './CategoryBadge';
import { PriceBadge } from './PriceBadge';
import { Card, ConsensusBadge } from './ui';
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
    <Card testID="restaurant-card" onPress={onPress} accessibilityLabel={item.name} className="mb-2">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 font-serif-semibold text-base text-ink dark:text-ink-dark">
          {item.name}
        </Text>
        {item.consensus != null ? <ConsensusBadge score={item.consensus} className="ml-2" /> : null}
        {item.bookmarked === 1 ? (
          <Ionicons
            name="bookmark"
            size={16}
            color={tokens.color.accent}
            style={{ marginLeft: 6 }}
            accessibilityLabel="Bookmarked"
          />
        ) : null}
      </View>

      {item.zone ? (
        <Text className="mt-0.5 font-sans text-xs text-muted dark:text-muted-dark">{item.zone}</Text>
      ) : null}

      <View className="mt-2 flex-row items-center gap-2">
        <CategoryBadge category={item.category} />
        {item.price_range ? <PriceBadge price={item.price_range} /> : null}

        <View
          testID="card-stars"
          className="flex-row items-center"
          style={{ opacity: item.visited ? 1 : 0.4 }}
        >
          <Ionicons name="star" size={13} color={tokens.color.accent} />
          <Text className="ml-0.5 font-sans text-xs text-muted dark:text-muted-dark">
            {stars != null ? stars.toFixed(1) : '—'}
          </Text>
        </View>

        {item.visited === 1 ? (
          <Ionicons
            name="checkmark-circle"
            size={14}
            color={tokens.color.secondary}
            accessibilityLabel="Visited"
          />
        ) : null}

        {item.distanceKm != null ? (
          <Text className="ml-auto font-sans text-xs text-muted dark:text-muted-dark">
            {formatDistance(item.distanceKm)}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}
