import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

// Success-but-no-data state: icon + headline + body + optional CTA (DESIGN_PLAN
// §4). Distinct from loading (Skeleton) and failure (ErrorState).
export function EmptyState({
  icon = 'restaurant-outline',
  title,
  body,
  actionLabel,
  onAction,
  testID = 'empty-state',
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}) {
  return (
    <View testID={testID} className="items-center px-6 py-10">
      <Ionicons name={icon} size={40} color="#A8A29E" />
      <Text className="mt-3 text-center font-serif-semibold text-base text-ink dark:text-ink-dark">
        {title}
      </Text>
      {body ? (
        <Text className="mt-1 text-center font-sans text-sm text-muted dark:text-muted-dark">
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-4">
          <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" />
        </View>
      ) : null}
    </View>
  );
}
