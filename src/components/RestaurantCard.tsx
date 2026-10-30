import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RestaurantListItem } from '@/db/repo';
import { CategoryBadge } from './CategoryBadge';
import { PriceBadge } from './PriceBadge';
import { Card, ConsensusBadge } from './ui';
import { TileThumb } from './Azulejo';
import { formatDistance } from '@/utils/formatDistance';
import { useThemeColors } from '@/hooks/useThemeColors';

export function RestaurantCard({
  item,
  onPress,
  onToggleBookmark,
}: {
  item: RestaurantListItem;
  onPress?: () => void;
  onToggleBookmark?: () => void;
}) {
  const stars = item.personalRating;
  const c = useThemeColors();
  const bookmarked = item.bookmarked === 1;
  return (
    <Card testID="restaurant-card" onPress={onPress} accessibilityLabel={item.name} className="mb-2">
      <View className="flex-row items-center gap-3">
        <TileThumb id={item.id} category={item.category} size={48} />

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              numberOfLines={1}
              className="flex-1 font-serif-semibold text-base text-ink dark:text-ink-dark"
            >
              {item.name}
            </Text>
            {item.consensus != null ? (
              <ConsensusBadge score={item.consensus} className="ml-2" />
            ) : null}
            {onToggleBookmark ? (
              <Pressable
                testID="bookmark-toggle"
                onPress={onToggleBookmark}
                accessibilityRole="button"
                accessibilityState={{ selected: bookmarked }}
                accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                hitSlop={8}
                className="ml-1.5 p-0.5"
              >
                <Ionicons
                  name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={bookmarked ? c.accent : c.muted}
                />
              </Pressable>
            ) : bookmarked ? (
              <Ionicons
                name="bookmark"
                size={16}
                color={c.accent}
                style={{ marginLeft: 6 }}
                accessibilityLabel="Bookmarked"
              />
            ) : null}
          </View>

          {item.zone ? (
            <Text
              numberOfLines={1}
              className="mt-0.5 font-sans text-xs text-muted dark:text-muted-dark"
            >
              {item.zone}
            </Text>
          ) : null}

          <View className="mt-2 flex-row items-center gap-2">
            <CategoryBadge category={item.category} />
            {item.price_range ? <PriceBadge price={item.price_range} /> : null}

            <View
              testID="card-stars"
              className="flex-row items-center"
              style={{ opacity: item.visited ? 1 : 0.4 }}
            >
              <Ionicons name="star" size={13} color={c.accent} />
              <Text className="ml-0.5 font-sans text-xs text-muted dark:text-muted-dark">
                {stars != null ? stars.toFixed(1) : '—'}
              </Text>
            </View>

            {item.visited === 1 ? (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={c.secondary}
                accessibilityLabel="Visited"
              />
            ) : null}

            {item.distanceKm != null ? (
              <Text className="ml-auto font-sans text-xs text-muted dark:text-muted-dark">
                {formatDistance(item.distanceKm)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  );
}
