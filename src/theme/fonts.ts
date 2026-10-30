import {
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Font map for expo-font's useFonts. Each weight is registered under its own
// family name rather than relying on RN's unreliable weight synthesis for
// custom fonts — Tailwind's font-* keys (tailwind.config.js) map to these exact
// names. Archivo = bold editorial display (AZULEJO); Inter = body/UI.
// The Tailwind `serif*` keys are repointed at Archivo (minimal-diff: the ~10
// existing `font-serif*` class sites keep working), plus `serif-black` for the
// PAPAZ wordmark.
export const FONT_MAP = {
  Archivo: Archivo_600SemiBold,
  'Archivo-SemiBold': Archivo_600SemiBold,
  'Archivo-Bold': Archivo_700Bold,
  'Archivo-ExtraBold': Archivo_800ExtraBold,
  Inter: Inter_400Regular,
  'Inter-Medium': Inter_500Medium,
  'Inter-SemiBold': Inter_600SemiBold,
  'Inter-Bold': Inter_700Bold,
} as const;
