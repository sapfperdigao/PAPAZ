// WCAG 2.1 contrast ratio checker for the AZULEJO palette
// (spec 2026-10-30-papaz-azulejo-redesign). Pure, no deps.
// Run with: node docs/design/contrast.mjs
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

// AZULEJO palette — mirrors src/theme/tokens.ts. Dark-mode fills are bright so
// their navy `accentFg` text clears AA. `nata` gold pill carries navy text;
// category fills carry navy ink text.
const P = {
  light: { base: '#F3F6FC', surface: '#FFFFFF', ink: '#0A1A3F', muted: '#5B6B8C', accent: '#1446C8', secondary: '#1F7A8C', accentFg: '#FFFFFF', nata: '#F4B740' },
  dark:  { base: '#070D1F', surface: '#111A33', ink: '#EAF0FB', muted: '#9DB0D6', accent: '#6FA8FF', secondary: '#67E8F9', accentFg: '#0A1A3F', nata: '#F4B740' },
};
// Category fills (both modes) rendered with navy-ink text in the Badge.
const CAT = { tasca: '#F4B740', cervejaria: '#6FA8FF', marisqueira: '#5FC2C7', other: '#AEB9CE' };
const NAVY = '#0A1A3F';

// [label, fg, bg, threshold]  (4.5 normal text, 3.0 large/UI).
const checks = {
  light: [
    ['ink on base',        P.light.ink,     P.light.base,    4.5],
    ['ink on surface',     P.light.ink,     P.light.surface, 4.5],
    ['muted on base',      P.light.muted,   P.light.base,    4.5],
    ['muted on surface',   P.light.muted,   P.light.surface, 4.5],
    ['accentFg on accent', P.light.accentFg,P.light.accent,  4.5],
    ['accentFg on secondary',P.light.accentFg,P.light.secondary,4.5],
    ['score navy on nata pill', NAVY, P.light.nata, 4.5],
    ['accent on base (link/icon, large/UI)', P.light.accent, P.light.base, 3.0],
    ['cat tasca (navy text)',       NAVY, CAT.tasca,       4.5],
    ['cat cervejaria (navy text)',  NAVY, CAT.cervejaria,  4.5],
    ['cat marisqueira (navy text)', NAVY, CAT.marisqueira, 4.5],
    ['cat other (navy text)',       NAVY, CAT.other,       4.5],
  ],
  dark: [
    ['ink on base',        P.dark.ink,      P.dark.base,     4.5],
    ['ink on surface',     P.dark.ink,      P.dark.surface,  4.5],
    ['muted on base',      P.dark.muted,    P.dark.base,     4.5],
    ['muted on surface',   P.dark.muted,    P.dark.surface,  4.5],
    ['accentFg on accent', P.dark.accentFg, P.dark.accent,   4.5],
    ['accentFg on secondary',P.dark.accentFg,P.dark.secondary,4.5],
    ['score navy on nata pill', NAVY, P.dark.nata, 4.5],
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
