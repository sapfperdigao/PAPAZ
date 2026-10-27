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
        base: { DEFAULT: '#FAF7F2', dark: '#0C0A09' },
        surface: { DEFAULT: '#FFFFFF', dark: '#1C1917' },
        ink: { DEFAULT: '#1C1917', dark: '#FAFAF9' },
        muted: { DEFAULT: '#6B6660', dark: '#A8A29E' },
        accent: { DEFAULT: '#C2410C', dark: '#EA580C' },
        'accent-fg': { DEFAULT: '#FFFFFF', dark: '#1C1917' },
        secondary: { DEFAULT: '#0F766E', dark: '#2DD4BF' },
        danger: { DEFAULT: '#DC2626', dark: '#F87171' },
      },
      borderRadius: { card: '16px', badge: '8px', button: '12px', pill: '9999px' },
      fontFamily: { serif: ['Fraunces'], sans: ['Inter'] },
    },
  },
  plugins: [],
};
