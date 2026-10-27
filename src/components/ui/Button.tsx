import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { cn } from '@/utils/cn';
import { palette } from '@/theme/tokens';

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
  leftIconName,
  className,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  className?: string;
  testID?: string;
}) {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';
  // Icon color matches the label fg for the variant + mode (keeps AA).
  const iconColor =
    variant === 'ghost'
      ? dark
        ? palette.accent.dark
        : palette.accent.light
      : dark
        ? palette.accentFg.dark
        : palette.accentFg.light;

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
      {leftIconName ? <Ionicons name={leftIconName} size={16} color={iconColor} /> : null}
      <Text className={cn('font-sans-semibold text-sm', LABEL[variant])}>{label}</Text>
    </Pressable>
  );
}
