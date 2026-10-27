// WCAG 2.1 contrast ratio checker for the Warm Terracotta palette (DESIGN_PLAN §2.3).
// Pure, no deps. Run with: node docs/design/contrast.mjs
function lin(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function L(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function ratio(a, b) {
  const la = L(a), lb = L(b);
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

// Palette reflects shipping values: light muted darkened to #6B6660 (was
// #78716C, 4.49 FAIL). Accent AND secondary fills use mode-aware fg:
// white in light, near-black in dark — encoded once in Button/Chip/Badge.
const P = {
  light: { base: '#FAF7F2', surface: '#FFFFFF', ink: '#1C1917', muted: '#6B6660', accent: '#C2410C', secondary: '#0F766E', accentFg: '#FFFFFF' },
  dark:  { base: '#0C0A09', surface: '#1C1917', ink: '#FAFAF9', muted: '#A8A29E', accent: '#EA580C', secondary: '#2DD4BF', accentFg: '#1C1917' },
};

// [label, fg, bg, threshold]  (4.5 normal text, 3.0 large/UI). Each pairing
// is one we actually render — the fg on accent/secondary is the mode's accentFg.
const checks = {
  light: [
    ['ink on base',        P.light.ink,     P.light.base,    4.5],
    ['ink on surface',     P.light.ink,     P.light.surface, 4.5],
    ['muted on base',      P.light.muted,   P.light.base,    4.5],
    ['muted on surface',   P.light.muted,   P.light.surface, 4.5],
    ['accentFg on accent', P.light.accentFg,P.light.accent,  4.5],
    ['accentFg on secondary',P.light.accentFg,P.light.secondary,4.5],
    ['accent on base (link/icon, large/UI)', P.light.accent, P.light.base, 3.0],
  ],
  dark: [
    ['ink on base',        P.dark.ink,      P.dark.base,     4.5],
    ['ink on surface',     P.dark.ink,      P.dark.surface,  4.5],
    ['muted on base',      P.dark.muted,    P.dark.base,     4.5],
    ['muted on surface',   P.dark.muted,    P.dark.surface,  4.5],
    ['accentFg on accent', P.dark.accentFg, P.dark.accent,   4.5],
    ['accentFg on secondary',P.dark.accentFg,P.dark.secondary,4.5],
    ['accent on base (link/icon, large/UI)', P.dark.accent, P.dark.base, 3.0],
  ],
};

let fails = 0;
for (const mode of ['light', 'dark']) {
  console.log(`\n== ${mode} ==`);
  for (const [label, fg, bg, th] of checks[mode]) {
    const r = ratio(fg, bg);
    const ok = r >= th;
    if (!ok) fails++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (need ${th})  ${label}  [${fg} on ${bg}]`);
  }
}
console.log(`\n${fails === 0 ? 'ALL PASS' : fails + ' FAILURES'}`);
