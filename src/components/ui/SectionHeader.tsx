import { View, Text, Pressable } from 'react-native';

// Section title with an optional "See all" action — for Home carousels
// (DESIGN_PLAN §4). Title uses the editorial serif.
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mb-2 flex-row items-end justify-between">
      <Text className="font-serif-semibold text-lg text-ink dark:text-ink-dark">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" accessibilityLabel={actionLabel} hitSlop={8}>
          <Text className="font-sans-semibold text-sm text-accent dark:text-accent-dark">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
