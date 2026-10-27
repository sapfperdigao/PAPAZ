import type { ReactNode } from 'react';
import { View, Pressable } from 'react-native';
import { cn } from '@/utils/cn';

// Rounded surface container with the card radius + a subtle border (DESIGN_PLAN
// §4). Pressable when onPress is given; a plain View otherwise.
export function Card({
  children,
  onPress,
  accessibilityLabel,
  className,
  testID,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
  testID?: string;
}) {
  const classes = cn(
    'rounded-card border border-black/5 bg-surface p-3 dark:border-white/10 dark:bg-surface-dark',
    className,
  );
  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={classes}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View testID={testID} className={classes}>
      {children}
    </View>
  );
}
