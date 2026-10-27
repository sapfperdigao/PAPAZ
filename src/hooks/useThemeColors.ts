import { useColorScheme } from 'nativewind';
import { palette } from '@/theme/tokens';

// Resolves palette colors for the active scheme, for the handful of call sites
// that pass a color straight to a native prop (Ionicon `color`,
// `placeholderTextColor`) where a Tailwind dark: class can't reach. Keeps those
// sites mode-aware so dark mode doesn't render the light hue (DESIGN_PLAN §2.3).
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const k = colorScheme === 'dark' ? 'dark' : 'light';
  return {
    accent: palette.accent[k],
    secondary: palette.secondary[k],
    muted: palette.muted[k],
    ink: palette.ink[k],
    danger: palette.danger[k],
  };
}
