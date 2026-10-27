import type { Category } from '@/domain';

// Design tokens — Warm Terracotta palette (DESIGN_PLAN §2.1, §3.1). Evolved from
// the spec's dark-first amber (spec delta §8.4 #2). Every text/bg pairing here is
// WCAG 2.1 AA verified (see .superpowers/sdd/design-plan/contrast.mjs).
//
// `palette` is the light/dark source of truth. `tokens.color.*` keeps scalar,
// light-hero defaults for the handful of call sites that pass a color straight to
// a native prop (Ionicon `color`, inline `backgroundColor`); those go mode-aware
// in Phase 5. Tailwind semantic classes (bg-base, text-ink, …) are the primary
// styling path — see tailwind.config.js, kept in sync with these values.
export const palette = {
  base: { light: '#FAF7F2', dark: '#0C0A09' },
  surface: { light: '#FFFFFF', dark: '#1C1917' },
  ink: { light: '#1C1917', dark: '#FAFAF9' },
  muted: { light: '#6B6660', dark: '#A8A29E' }, // light darkened from #78716C (4.49 → 5.32 AA)
  accent: { light: '#C2410C', dark: '#EA580C' },
  // Mode-aware foreground for accent/secondary fills: white in light, near-black
  // in dark. Encoded once; Button/Chip/Badge read it so every fill passes AA.
  accentFg: { light: '#FFFFFF', dark: '#1C1917' },
  secondary: { light: '#0F766E', dark: '#2DD4BF' },
  danger: { light: '#DC2626', dark: '#F87171' },
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
  // Category badge colors — each its own hue, none reused for accent/secondary/
  // muted (DESIGN_PLAN §2.1). All clear AA with dark `ink` text. `other` is a
  // legible slate neutral (was #9A9A9A, the muted-text grey — now distinct).
  category: {
    tasca: '#E8A838',
    cervejaria: '#4A90D9',
    marisqueira: '#2BB5A0',
    other: '#94A3B8',
  } satisfies Record<Category, string>,
  // Dedicated consensus-badge token — neutral ink chip, distinct from accent so
  // the score never clashes with a category color (DESIGN_PLAN §2.1).
  consensusBadge: {
    bg: { light: palette.ink.light, dark: palette.ink.dark },
    fg: { light: palette.base.light, dark: palette.base.dark },
  },
  // 4pt grid.
  spacing: (n: number) => n * 4,
  radius: { card: 16, badge: 8, button: 12, pill: 9999 },
  // Editorial type pairing (spec delta §8.4 #1) — loaded via expo-font in Phase 1.
  fontFamily: { serif: 'Fraunces', sans: 'Inter' },
} as const;
