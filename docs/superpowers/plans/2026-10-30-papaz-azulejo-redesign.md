# PAPAZ AZULEJO Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the entire PAPAZ app from the cream/terracotta "Warm Terracotta" system to the bold cobalt-and-gold **AZULEJO** identity, with generative azulejo-tile imagery and deliberate motion, while keeping all behaviour, tests, and offline-first architecture intact.

**Architecture:** The app styles via NativeWind v4 semantic classes (`bg-base`, `text-ink`, `font-serif*`) whose values live in `src/theme/tokens.ts` (`palette`) mirrored in `tailwind.config.js`, plus a `useThemeColors` hook for native color props. Re-skinning is therefore mostly: (1) rewrite the token values + Tailwind mirror, (2) swap the display font, (3) add a generative-tile component system, (4) restyle the shared component kit (which most screens inherit from), then (5) touch each screen for hero/imagery/motion specifics. Scoring, DB, and seed are untouched.

**Tech Stack:** Expo SDK 52, expo-router 4, React Native 0.76, NativeWind v4, react-native-reanimated 3.16, @expo-google-fonts/archivo (new), react-native-svg (new), jest-expo.

**Spec:** `docs/superpowers/specs/2026-10-30-papaz-azulejo-redesign-design.md`

## Global Constraints

- Expo SDK 52 / RN 0.76 / NativeWind v4 — use `expo install` for new native deps so versions match the SDK.
- Styling goes through the token system: never hardcode a hex in a screen; add/boot it in `palette` + `tailwind.config.js` and consume the semantic class or `useThemeColors`.
- Every text/background pairing passes WCAG 2.1 AA — verified by `node docs/design/contrast.mjs` for both light and dark.
- Offline-first: no network calls for imagery. Imagery is generative (SVG tiles), deterministic from restaurant id + category.
- Do NOT modify: `src/scoring/*`, DB schema/migrations, seed data (`src/db/seeds/*`, `src/db/seed.ts`), the internal `MesaDb` type or `mesa.db` filename.
- Preserve existing testIDs and a11y labels: `restaurant-card`, `card-stars`, `category-badge`, `consensus-badge`, and all accessibility roles/labels. Component tests assert against `tokens.*` values and these IDs.
- `npm test` stays green (27 files); `npm run typecheck` stays clean. Snapshot tests in `ui-primitives.test.tsx` / `RestaurantCard.test.tsx` will intentionally change — refresh with `npm test -- -u` and eyeball the diff; never edit a snapshot by hand.
- Motion respects `prefers-reduced-motion` (reanimated `useReducedMotion()`); keyboard focus stays visible.

## Review Focus

- **Unknown/empty category passed to the tile generator** → must return a valid fallback tile, never throw or render blank. Tested in Task 3.
- **react-native-svg under jest-expo and in the sql.js web export** → the suite must not crash on import, and `expo export --platform web` must still render tiles. Verified in Task 3 (jest) and Task 9 (web).
- **Very long restaurant names/zones next to a tile thumb** → card/row layout must truncate (`numberOfLines`), not overflow or shove the score off-screen. Tested in Task 4.
- **Reduced-motion on** → the Home entrance stagger is skipped (static render), not merely faster. Verified in Task 5 and Task 9.
- **Dark-mode ("AZULEJO night") contrast** → new dark palette pairings pass AA, not just light. Covered by the contrast script in Task 1.

---

### Task 1: AZULEJO color tokens + Tailwind mirror + contrast

**Files:**
- Modify: `package.json` (add `react-native-svg`, `@expo-google-fonts/archivo` via `expo install`)
- Modify: `src/theme/tokens.ts` (`palette`, `tokens.color`, `category`, `consensusBadge`, `radius`)
- Modify: `tailwind.config.js` (colors, borderRadius)
- Modify: `src/hooks/useThemeColors.ts` (new hexes)
- Modify: `docs/design/contrast.mjs` (new pairings) and run it
- Test: existing suite + contrast script

**Interfaces:**
- Produces: `palette` with keys `base, surface, ink, muted, accent, accentFg, secondary, danger` each `{light, dark}`, plus `tokens.category` (4 keys: `tasca, cervejaria, marisqueira, other`), `tokens.consensusBadge.{bg,fg}`, `tokens.radius`. Exact light values: `base #F3F6FC`, `surface #FFFFFF`, `ink #0A1A3F`, `muted #5B6B8C`, `accent(cobalt) #1446C8`, `accentFg #FFFFFF`, `secondary #1F7A8C`, `danger #DC2626`; nata gold `#F4B740` lives in `consensusBadge.bg` (fg `#0A1A3F`) and `category.tasca`. Dark values: `base #070D1F`, `surface #111A33`, `ink #EAF0FB`, `muted #9DB0D6`, `accent #3D6BE5`, `accentFg #0A1A3F`, `secondary #67E8F9`. `category`: `tasca #F4B740`, `cervejaria #1446C8`, `marisqueira #6FA8FF`, `other #64748B`. `radius`: card `14`, badge `8`, button `12`, pill `9999`.

- [ ] **Step 1:** Run `npx expo install react-native-svg @expo-google-fonts/archivo`. Verify both appear in `package.json` dependencies.
- [ ] **Step 2:** Rewrite `palette` and `tokens.color`/`category`/`consensusBadge`/`radius` in `src/theme/tokens.ts` with the exact values in Interfaces. Keep the shape identical (same keys) so consumers and the token-based tests keep compiling.
- [ ] **Step 3:** Mirror the same values into `tailwind.config.js` `colors` and `borderRadius`.
- [ ] **Step 4:** Update `src/hooks/useThemeColors.ts` so its returned hexes match the new palette (accent, muted, secondary, etc.).
- [ ] **Step 5:** Update the pairings in `docs/design/contrast.mjs` to the new light + dark palette and run `node docs/design/contrast.mjs`. Expected: every pairing reports AA pass. If any fails, nudge the `muted`/`secondary` lightness until it passes and update the token.
- [ ] **Step 6:** Run `npm test` and `npm run typecheck`. Expected: still green (category tests read `tokens.category.*`, so they follow the retune automatically). Snapshots may shift only if values embedded in markup changed — if so, `npm test -- -u` and eyeball.
- [ ] **Step 7:** Commit (`feat: AZULEJO color tokens + contrast`).

---

### Task 2: Swap display font Fraunces → Archivo

**Files:**
- Modify: `src/theme/fonts.ts` (`FONT_MAP`)
- Modify: `tailwind.config.js` (`fontFamily` keys)
- Modify: `src/theme/tokens.ts` (`tokens.fontFamily`)
- Modify: `app/_layout.tsx` (font-load gate family list)

**Interfaces:**
- Produces: `FONT_MAP` registering Archivo weights + Inter: `Fraunces`→`Archivo_700Bold` is NOT the approach — instead register under Archivo-named keys and **repoint the Tailwind `serif*` keys to the Archivo families** so the ~10 existing `font-serif*` class sites need no edits (deliberate minimal-diff; a rename to `font-display*` is explicitly out of scope). Keys: `serif → Archivo` (400→use 600 as base weight is fine), `serif-semibold → Archivo-SemiBold`, `serif-bold → Archivo-Bold`, and ADD `serif-black → Archivo-ExtraBold` for the wordmark. Inter keys unchanged.

- [ ] **Step 1:** Rewrite `FONT_MAP` in `src/theme/fonts.ts`: import `Archivo_600SemiBold, Archivo_700Bold, Archivo_800ExtraBold` from `@expo-google-fonts/archivo` and `Inter_*` as before; map family names `Archivo`, `Archivo-SemiBold`, `Archivo-Bold`, `Archivo-ExtraBold`, `Inter*`. Drop the Fraunces imports.
- [ ] **Step 2:** In `tailwind.config.js` `fontFamily`, point `serif → ['Archivo']`, `serif-semibold → ['Archivo-SemiBold']`, `serif-bold → ['Archivo-Bold']`, add `serif-black → ['Archivo-ExtraBold']`. Update `tokens.fontFamily.serif` to `'Archivo'`.
- [ ] **Step 3:** Update `app/_layout.tsx` if it references Fraunces family names in the font-ready gate; it should gate on `FONT_MAP` keys generically — confirm it boots with the new map.
- [ ] **Step 4:** Run `npm run typecheck` and `npm test`. Expected: clean/green (snapshots that embed font family strings refresh with `-u`).
- [ ] **Step 5:** Commit (`feat: swap display font to Archivo`).

---

### Task 3: Generative azulejo-tile system

**Files:**
- Create: `src/theme/tiles.ts` (pure logic — TDD)
- Create: `src/components/Azulejo.tsx` (SVG components)
- Create: `src/theme/__tests__/tiles.test.ts`
- Modify (if needed): jest config / a `react-native-svg` mock, only if the suite errors on import

**Interfaces:**
- Produces: `type TileMotif = 'quatrefoil' | 'star' | 'wave'`; `interface Tile { motif: TileMotif; tint: string; bg: string }`; `restaurantTile(id: string, category: Category): Tile` — deterministic (pure). `hashString(s: string): number`. Component API: `TilePattern({ motif, tint, bg, size })`, `TileThumb({ id, category, size }: {id:string; category:Category; size:number})`, `TileHero({ id, category }: {id:string; category:Category})`. Tint map: tasca→`#F4B740`, cervejaria→`#1446C8`, marisqueira→`#6FA8FF`, other→`#64748B`; unknown→`other`'s tint. `bg` always porcelain `#F3F6FC`.

- [ ] **Step 1: Write failing tests** in `tiles.test.ts`:

```ts
test('restaurantTile is deterministic', () => {
  expect(restaurantTile('abc', 'tasca')).toEqual(restaurantTile('abc', 'tasca'));
});
test('tint follows category', () => {
  expect(restaurantTile('x', 'cervejaria').tint).toBe('#1446C8');
});
test('unknown category falls back, never throws', () => {
  // @ts-expect-error exercising a bad value
  expect(() => restaurantTile('x', 'nope')).not.toThrow();
  // @ts-expect-error
  expect(restaurantTile('x', 'nope').tint).toBe('#64748B');
});
test('motif varies across ids', () => {
  const motifs = new Set(['a','b','c','d','e','f'].map(i => restaurantTile(i,'tasca').motif));
  expect(motifs.size).toBeGreaterThan(1);
});
```

- [ ] **Step 2:** Run `npm test src/theme/__tests__/tiles.test.ts`. Expected: FAIL (module not found).
- [ ] **Step 3:** Implement `hashString` and `restaurantTile` in `src/theme/tiles.ts` — pure, no React/SVG imports. Motif = `['quatrefoil','star','wave'][hashString(id) % 3]`; tint from the category map with fallback.
- [ ] **Step 4:** Run the test. Expected: PASS.
- [ ] **Step 5:** Implement `src/components/Azulejo.tsx` using `react-native-svg` (`Svg`, `Pattern`/`Defs`, `Path`, `Rect`). `TilePattern` tiles one motif path; `TileThumb` renders a `size`×`size` rounded (radius 10) tile from `restaurantTile`; `TileHero` renders a full-width ~140px band. Keep geometry simple and crisp.
- [ ] **Step 6:** Add a render smoke test (render `TileThumb` with a sample id/category; assert it renders). Run `npm test`. If it errors on `react-native-svg` import under jest-expo, add the standard mock (`jest.mock('react-native-svg', ...)` in a setup file or `moduleNameMapper`) and re-run. Expected: green.
- [ ] **Step 7:** Commit (`feat: generative azulejo tile system`).

---

### Task 4: Restyle the shared component kit

**Files:**
- Modify: `src/components/ui/*` (`Card, Chip, Badge, ConsensusBadge, Button, Stat, SectionHeader, EmptyState, ErrorState, Skeleton`, `RatingBar`)
- Modify: `src/components/CategoryBadge.tsx`, `src/components/PriceBadge.tsx`, `src/components/RestaurantCard.tsx`
- Test: `src/components/__tests__/ui-primitives.test.tsx`, `RestaurantCard.test.tsx`, `CategoryBadge.test.tsx`, `RatingBar.test.tsx` (refresh snapshots)

**Interfaces:**
- Consumes: tokens (Task 1), fonts (Task 2), `TileThumb` (Task 3).
- Produces: restyled kit. `ConsensusBadge` now a gold pill (nata bg, navy fg) — keep `score` prop, testID `consensus-badge`, a11y label format unchanged. `RestaurantCard` gains a leading `TileThumb` (size 48) and an optional `onToggleBookmark?: () => void` making the bookmark icon an interactive toggle; keep testIDs `restaurant-card`, `card-stars`, keep `numberOfLines` on name/zone.

- [ ] **Step 1:** Restyle each primitive to the cobalt/gold system via semantic classes (cards radius-14 on surface with a hairline cobalt-tinted border, chips as cobalt/gold pills with the existing active a11y state, `ConsensusBadge` gold). Do not change component prop signatures except `RestaurantCard.onToggleBookmark`.
- [ ] **Step 2:** Add a failing test in `RestaurantCard.test.tsx`: a very long name (80 chars) still renders the score (query `consensus-badge`) and the name node has `numberOfLines`. Run → expect FAIL if not yet handled, then ensure the card truncates. Also add: tapping the bookmark calls `onToggleBookmark`.
- [ ] **Step 3:** Wire `TileThumb` into `RestaurantCard` and `FeaturedCard`-style usages; make bookmark icon a `Pressable` calling `onToggleBookmark`.
- [ ] **Step 4:** Run `npm test`. Behavioral assertions must pass. Snapshots will differ by design → `npm test -- -u`, then open the snapshot diff and confirm the markup changes are the intended restyle (no lost a11y props, testIDs intact).
- [ ] **Step 5:** `npm run typecheck`. Expected: clean.
- [ ] **Step 6:** Commit (`feat: restyle component kit to AZULEJO`).

---

### Task 5: Home screen — tile hero, imagery, one motion moment

**Files:**
- Modify: `app/(tabs)/home.tsx`
- Test: existing suite (no Home unit test; verified via web QA)

**Interfaces:**
- Consumes: kit (Task 4), `TileThumb`/`TileHero` (Task 3), reanimated.

- [ ] **Step 1:** Replace the plain hero with a cobalt `TileHero` band carrying the white `PAPAZ` wordmark (`font-serif-black`) + a gold accent mark + tagline; keep greeting + search.
- [ ] **Step 2:** Give `FeaturedCard` and the want-to-try/recent rows a `TileThumb`; gold score pills come from the restyled `ConsensusBadge`; Explore chips use the restyled cobalt/gold `Chip`.
- [ ] **Step 3:** One motion moment: stagger the Top-rated carousel entrance (`FadeInDown` with per-index delay). Gate it behind `useReducedMotion()` — when reduced, render with no entering animation.
- [ ] **Step 4:** `npm test` + `npm run typecheck` green. Web QA (Task 9 captures screenshots) — for now confirm it renders in `expo start` web with 0 console errors.
- [ ] **Step 5:** Commit (`feat: AZULEJO home screen`).

---

### Task 6: List + Filters

**Files:**
- Modify: `app/(tabs)/list.tsx`, `app/filters.tsx`

- [ ] **Step 1:** Apply the cobalt header treatment; rows already inherit the restyled `RestaurantCard` (tile thumb, gold score, bookmark toggle) — wire `onToggleBookmark` to the bookmark mutation used elsewhere.
- [ ] **Step 2:** Restyle sort chips and the `/filters` sheet (chips, buttons, headings) via the kit.
- [ ] **Step 3:** `npm test` + `npm run typecheck` green; renders on web with 0 console errors.
- [ ] **Step 4:** Commit (`feat: AZULEJO list + filters`).

---

### Task 7: Restaurant detail (UX enrichment) + Edit

**Files:**
- Modify: `app/restaurant/[id]/_layout.tsx` (top-tab bar), `overview.tsx`, `dishes.tsx`, `wine.tsx`, `my-notes.tsx`, `app/restaurant/edit/[id].tsx`

**Interfaces:**
- Consumes: kit, tiles, `useRestaurant`/`useRatings`/`useConsensus` and existing dishes/wine/notes hooks.

- [ ] **Step 1:** Add a `TileHero` band behind the name on `overview.tsx`.
- [ ] **Step 2 (the UX win):** Enrich `overview.tsx` so it's the primary surface — gold consensus numerals + source `RatingBar`, a your-rating row (personal rating + visited/bookmark quick toggles using existing mutations), the Maps/Website actions, and compact count rows linking to Dishes / Wine / Notes (counts from their hooks) so tab-hopping becomes optional. Keep it to data already available; no new DB work.
- [ ] **Step 3:** Restyle the material-top-tab bar (cobalt indicator/active, gold accent) and apply the kit to Dishes/Wine/Notes and the Edit form (preserve `RestaurantForm` behaviour + its tests).
- [ ] **Step 4:** `npm test` + `npm run typecheck` green (refresh `RestaurantForm`/related snapshots if markup changed); renders on web with 0 console errors.
- [ ] **Step 5:** Commit (`feat: AZULEJO restaurant detail + edit`).

---

### Task 8: Bookmarks, Add, and the tab bar

**Files:**
- Modify: `app/(tabs)/bookmarks.tsx`, `app/(tabs)/add.tsx`, `app/(tabs)/_layout.tsx`

- [ ] **Step 1:** Restyle the bottom tab bar (active = cobalt, with a gold touch on the Home/active tab) in `_layout.tsx`.
- [ ] **Step 2:** Apply the kit + tile thumbs + empty/error states to Bookmarks and Add.
- [ ] **Step 3:** `npm test` + `npm run typecheck` green; both render on web with 0 console errors.
- [ ] **Step 4:** Commit (`feat: AZULEJO bookmarks, add, tab bar`).

---

### Task 9: Whole-app verification

**Files:** none (verification + any fix-ups)

- [ ] **Step 1:** `npm test` — all 27 files green. `npm run typecheck` — clean.
- [ ] **Step 2:** `node docs/design/contrast.mjs` — AA pass, light + dark.
- [ ] **Step 3:** Grep for stray old palette hexes (`FAF7F2`, `C2410C`, `EA580C`, `Fraunces`) across `app/` and `src/` — expect none outside comments/history.
- [ ] **Step 4:** `npx expo export --platform web` — succeeds, tiles render (confirms react-native-svg works in the web build).
- [ ] **Step 5:** Serve the export and screenshot Home, List, a restaurant detail, Bookmarks, Add, Filters at phone width; review each against the AZULEJO mockup; confirm 0 console errors.
- [ ] **Step 6:** Toggle `prefers-reduced-motion` and confirm the Home entrance is static.
- [ ] **Step 7:** Commit any fix-ups (`chore: AZULEJO redesign verification`).

## Verification (success criteria)

1. All 7 screen areas + the kit render in AZULEJO; no stray cream/terracotta hexes (Task 9 Step 3).
2. `npm test` 27/27 files green; `npm run typecheck` clean.
3. `node docs/design/contrast.mjs` AA pass, light + dark.
4. Web QA screenshots captured + reviewed, 0 console errors.
5. Reduced-motion disables entrance animations; focus visible.
6. Reads as cool/young/colourful/alive vs. the AZULEJO mockup.
