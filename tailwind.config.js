/** @type {import('tailwindcss').Config} */
// Semantic color + radius + font tokens (DESIGN_PLAN §3.1). Values mirror
// src/theme/tokens.ts (palette) — keep the two in sync. darkMode 'class' and the
// boot-time setColorScheme that drives it are added in Phase 1.
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: { DEFAULT: '#F3F6FC', dark: '#070D1F' },
        surface: { DEFAULT: '#FFFFFF', dark: '#111A33' },
        ink: { DEFAULT: '#0A1A3F', dark: '#EAF0FB' },
        muted: { DEFAULT: '#5B6B8C', dark: '#9DB0D6' },
        accent: { DEFAULT: '#1446C8', dark: '#6FA8FF' },
        'accent-fg': { DEFAULT: '#FFFFFF', dark: '#0A1A3F' },
        secondary: { DEFAULT: '#1F7A8C', dark: '#67E8F9' },
        danger: { DEFAULT: '#DC2626', dark: '#F87171' },
        nata: { DEFAULT: '#F4B740', dark: '#F4B740' },
        ceu: { DEFAULT: '#6FA8FF', dark: '#6FA8FF' },
      },
      borderRadius: { card: '14px', badge: '8px', button: '12px', pill: '9999px' },
      // Keys map to the exact family names registered in src/theme/fonts.ts.
      // Use font-serif* for display, font-sans* for body/UI, at explicit weights.
      fontFamily: {
        serif: ['Fraunces'],
        'serif-semibold': ['Fraunces-SemiBold'],
        'serif-bold': ['Fraunces-Bold'],
        sans: ['Inter'],
        'sans-medium': ['Inter-Medium'],
        'sans-semibold': ['Inter-SemiBold'],
        'sans-bold': ['Inter-Bold'],
      },
    },
  },
  plugins: [],
};
