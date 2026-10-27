import { View, Text } from 'react-native';
import { cn } from '@/utils/cn';

// Small status/label chip (DESIGN_PLAN §4). Two forms: a solid fill when a
// `color` is given (category badges pass their own hue, rendered with dark ink
// text — all category colors clear AA that way, §2.1), or an outline otherwise.
export function Badge({
  label,
  color,
  className,
  testID,
}: {
  label: string;
  color?: string;
  className?: string;
  testID?: string;
}) {
  if (color) {
    return (
      <View
        testID={testID}
        className={cn('self-start rounded-badge px-2 py-0.5', className)}
        style={{ backgroundColor: color }}
      >
        <Text className="font-sans-semibold text-xs" style={{ color: '#1C1917' }}>
          {label}
        </Text>
      </View>
    );
  }
  return (
    <View
      testID={testID}
      className={cn(
        'self-start rounded-badge border border-black/15 px-2 py-0.5 dark:border-white/20',
        className,
      )}
    >
      <Text className="font-sans-semibold text-xs text-muted dark:text-muted-dark">{label}</Text>
    </View>
  );
}
