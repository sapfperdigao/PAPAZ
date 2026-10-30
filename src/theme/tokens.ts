import type { Category } from '@/domain';

// Design tokens — AZULEJO palette (spec 2026-10-30-papaz-azulejo-redesign).
// Portuguese blue-and-white tile tradition reimagined bold: cobalt brand,
// pastel-de-nata gold spark, tile-blue (céu), navy ink, on cool porcelain.
// Replaces the former Warm Terracotta system. Every text/bg pairing here is
// WCAG 2.1 AA verified (see docs/design/contrast.mjs).
//
// `palette` is the light/dark source of truth. `tokens.color.*` keeps scalar
// light values for back-compat; call sites that pass a color to a native prop
// (Ionicon `color`, `placeholderTextColor`) read the mode-aware useThemeColors
// hook instead. Tailwind semantic classes (bg-base, text-ink, text-accent,
// bg-nata, …) are the primary styling path — see tailwind.config.js, kept in
// sync with these values.
//
// Dark mode ("AZULEJO night"): accent/secondary flip to BRIGHT fills so their
// near-navy `accentFg` text clears AA — same inversion strategy the palette
// has always used, just in blue instead of amber.
export const palette = {
  base: { light: '#F3F6FC', dark: '#070D1F' },
  surface: { light: '#FFFFFF', dark: '#111A33' },
  ink: { light: '#0A1A3F', dark: '#EAF0FB' },
  muted: { light: '#5B6B8C', dark: '#9DB0D6' },
  accent: { light: '#1446C8', dark: '#6FA8FF' }, // cobalt (light) / bright céu (dark)
  // Mode-aware foreground for accent/secondary fills: white in light, navy-ink
  // in dark (dark-mode fills are bright). Encoded once; Button/Chip/Badge read it.
  accentFg: { light: '#FFFFFF', dark: '#0A1A3F' },
  secondary: { light: '#1F7A8C', dark: '#67E8F9' },
  danger: { light: '#DC2626', dark: '#F87171' },
  // Brand accents used directly by screens/kit (bg-nata, text-ceu …).
  nata: { light: '#F4B740', dark: '#F4B740' }, // pastel-de-nata gold — the spark
  ceu: { light: '#6FA8FF', dark: '#6FA8FF' }, // lighter tile-blue
} as const;

export const tokens = {
  color: {
    // Scalar light-hero defaults read directly in code (native color props).
    accent: palette.accent.light,
    danger: palette.danger.light,
    secondary: palette.secondary.light,
    // Nested light/dark retained for existing consumers.
    bg: { dark: palette.base.dark, light: palette.base.light },
    surface: { dark: palette.surface.dark, light: palette.surface.light },
    textPrimary: { dark: palette.ink.dark, light: palette.ink.light },
    textSecondary: { dark: palette.muted.dark, light: palette.muted.light },
  },
  // Category badge colors — each a distinct hue inside the cobalt/gold world,
  // all light enough to clear AA with the badge's dark navy-ink text.
  category: {
    tasca: '#F4B740', // gold
    cervejaria: '#6FA8FF', // céu blue
    marisqueira: '#5FC2C7', // sea aqua
    other: '#AEB9CE', // light slate-blue
  } satisfies Record<Category, string>,
  // Consensus-badge token — now the pastel-de-nata gold pill with navy text,
  // so the score reads as the brand's warm spark against the cobalt world.
  consensusBadge: {
    bg: { light: palette.nata.light, dark: palette.nata.dark },
    fg: { light: palette.ink.light, dark: palette.ink.light }, // navy both modes
  },
  // 4pt grid.
  spacing: (n: number) => n * 4,
  // Crisper than before (cards 14) to echo tiles; pills stay full-round.
  radius: { card: 14, badge: 8, button: 12, pill: 9999 },
  // Editorial type pairing — Archivo display (Task 2), Inter body.
  fontFamily: { serif: 'Archivo', sans: 'Inter' },
} as const;
