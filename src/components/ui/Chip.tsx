import { Pressable, Text } from 'react-native';
import { cn } from '@/utils/cn';

// Filter/sort toggle pill (DESIGN_PLAN §4). Replaces the duplicated Chip in
// list.tsx and the inline Pressable chip in bookmarks.tsx. Active state uses the
// mode-aware accent fill (white fg in light, near-black in dark — §2.3), so it
// passes AA in both schemes. 44pt min touch target via hitSlop.
export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      hitSlop={8}
      className={cn(
        'rounded-pill border px-3 py-1.5',
        active
          ? 'border-accent bg-accent dark:border-accent-dark dark:bg-accent-dark'
          : 'border-black/15 bg-transparent dark:border-white/20',
      )}
    >
      <Text
        className={cn(
          'font-sans-semibold text-xs',
          active ? 'text-accent-fg dark:text-accent-fg-dark' : 'text-muted dark:text-muted-dark',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
