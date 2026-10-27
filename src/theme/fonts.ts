import {
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Font map for expo-font's useFonts (DESIGN_PLAN §2.2). Each weight is registered
// under its own family name rather than relying on RN's unreliable weight
// synthesis for custom fonts — Tailwind's font-* keys (tailwind.config.js) map to
// these exact names. Fraunces = editorial display; Inter = body/UI.
export const FONT_MAP = {
  Fraunces: Fraunces_400Regular,
  'Fraunces-SemiBold': Fraunces_600SemiBold,
  'Fraunces-Bold': Fraunces_700Bold,
  Inter: Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,
} as const;
