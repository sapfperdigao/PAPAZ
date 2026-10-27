import { Pressable, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

// Button primitive with primary/secondary/ghost variants (DESIGN_PLAN §4).
// Accent/secondary fills carry mode-aware foreground (§2.3). Min 44pt height via
// py + the sm/md sizing. accessibilityRole/Label baked in.
const CONTAINER: Record<Variant, string> = {
  primary: 'bg-accent dark:bg-accent-dark',
  secondary: 'bg-secondary dark:bg-secondary-dark',
  ghost: 'bg-transparent border border-black/15 dark:border-white/20',
};
const LABEL: Record<Variant, string> = {
  primary: 'text-accent-fg dark:text-accent-fg-dark',
  secondary: 'text-accent-fg dark:text-accent-fg-dark',
  ghost: 'text-accent dark:text-accent-dark',
};
const PAD: Record<Size, string> = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  leftIcon,
  className,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={cn(
        'min-h-11 flex-row items-center justify-center gap-2 rounded-button',
        CONTAINER[variant],
        PAD[size],
        disabled && 'opacity-40',
        className,
      )}
    >
      {leftIcon ? <View>{leftIcon}</View> : null}
      <Text className={cn('font-sans-semibold text-sm', LABEL[variant])}>{label}</Text>
    </Pressable>
  );
}
