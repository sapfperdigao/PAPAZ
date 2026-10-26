import type { Category } from '@/domain';

// Design tokens — values verbatim from spec §9 (dark-mode first, light supported).
export const tokens = {
  color: {
    bg: { dark: '#0F0F0F', light: '#F9F9F7' },
    surface: { dark: '#1C1C1E', light: '#FFFFFF' },
    accent: '#E8A838',
    textPrimary: { dark: '#FAFAFA', light: '#111111' },
    textSecondary: { dark: '#9A9A9A', light: '#6B6B6B' },
    danger: '#FF453A',
  },
  // Category badge colors (spec §9). 'other' is unspecified in the spec;
  // uses neutral secondary grey.
  category: {
    tasca: '#E8A838',
    cervejaria: '#4A90D9',
    marisqueira: '#2BB5A0',
    other: '#9A9A9A',
  } satisfies Record<Category, string>,
  // 4pt grid (spec §9).
  spacing: (n: number) => n * 4,
  radius: { card: 12, badge: 6, button: 10, pill: 999 },
} as const;
