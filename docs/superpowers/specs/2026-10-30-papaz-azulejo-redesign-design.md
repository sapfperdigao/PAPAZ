# PAPAZ — AZULEJO visual redesign

> Design doc. Written 2026-10-30. Audience: whoever plans and builds this (likely a fresh Claude session). Self-contained.
>
> **Decisions locked 2026-10-30 (owner):** imagery = generative azulejo tiles (not real photos); scope = whole app in one build (tokens + kit + all screens), then verify.

## Intent & why

PAPAZ's current look — warm cream background, high-contrast Fraunces serif, terracotta accent — is, by coincidence, the single most common "this was AI-generated" design cliché. That is *why* the app feels templated and lifeless despite solid engineering: the visual identity was never a deliberate choice, and the app has **no imagery and almost no colour**.

The owner wants a **cool, young, alive** app with **colour and motion**, and **easy navigation / fewer clicks to the info**. They chose the **AZULEJO** direction from three mockups: the Portuguese blue-and-white tile tradition reimagined bold and modern — cobalt-blue identity, pastel-de-nata gold accent, a tile-pattern motif as texture. It is the most distinctive, durable brand of the three and works day or night.

## Goals

- A single coherent AZULEJO visual system applied across **every** screen (Home, List, restaurant detail + its 4 sub-tabs, Bookmarks, Add, Filters, Edit) and the shared component kit.
- Bring **colour** (cobalt + gold + tile-blue, confidently used) and **imagery** (see Imagery below) to screens that are currently text-only.
- One deliberate **motion** moment per key screen, plus crisp interaction feedback — never the "fade-and-slide on everything" default.
- **UX: fewer clicks.** Make the restaurant detail's Overview rich enough to be the answer, so you rarely tab-hop; put the bookmark toggle on the cards themselves.
- Keep the quality floor: 90/90 jest tests pass, `tsc --noEmit` clean, WCAG AA contrast, dark mode works, reduced-motion respected.

## Non-goals / anti-goals

- **Not** building a photo-fetching backend or wiring a remote image API. Offline-first stays intact. (Imagery is generative — see below.)
- **Not** touching the scoring/consensus engine, the DB schema, or the seed data. The seed-refresh work is a separate open item and out of scope here.
- **Not** adding the deferred map surface.
- Internal `MesaDb` type and `mesa.db` filename stay as-is (renaming orphans on-device data).
- Anti-goal: a redesign that looks great on Home but leaves inner screens on the old cream system. Half-done is a failure even if Home is beautiful.

## The AZULEJO token system

Replaces the Warm Terracotta palette in `src/theme/tokens.ts` (`palette`) and its mirror in `tailwind.config.js`. All text/bg pairings must pass AA (re-run `node docs/design/contrast.mjs` after).

**Colour (light):**
- `porcelain` `#F3F6FC` — base (cool porcelain white; replaces cream `#FAF7F2`)
- `surface` `#FFFFFF` — raised cards
- `cobalt` `#1446C8` — brand / primary accent (replaces terracotta); big blue fields & the hero
- `ceu` `#6FA8FF` — lighter tile-blue, secondary
- `nata` `#F4B740` — pastel-de-nata gold; the spark — score pills, highlights, active states
- `navy` `#0A1A3F` — ink / text

**Colour (dark) — "AZULEJO night":** deep navy base `#070D1F`, surface `#111A33`, cobalt brightens to `#3D6BE5`, gold `#F4B740` holds, text `#EAF0FB`. Keeps the brand recognizable at night rather than a generic dark grey.

**Category hues** (currently gold/blue/teal/slate) retune to sit inside the cobalt world: tasca → nata gold, cervejaria → cobalt, marisqueira → céu, wine bar → a plum/berry, other → a muted slate-blue. Each still distinct and AA on its text.

**Type:** display **Archivo** (heavy/expanded weights) for the wordmark & titles — wide, bold, editorial-modern; body/UI **Inter** (kept). Swap `@expo-google-fonts/fraunces` → `@expo-google-fonts/archivo`. To minimise churn, repoint the existing Tailwind `serif*` font keys and `tokens.fontFamily.serif` to the Archivo family names so the ~10 `font-serif*` class sites don't each need editing (rename later if desired).

**Radius:** slightly crisper than the current soft 16 — cards `14`, with the hero and tile thumbs squarer to echo tiles. Pills stay full-round for chips.

## Imagery — generative azulejo tiles (the key decision)

The mockups felt alive largely because of photos, but **the app has no photo data** and we're not building a photo pipeline. The on-brand, offline answer: **every restaurant gets a deterministic generative tile** as its thumbnail (on cards) and hero band (on detail).

- A small set of azulejo motifs (quatrefoil, 8-point star, wave/vine) rendered as a repeating **SVG** pattern.
- Motif chosen by a hash of the restaurant id; tint derived from its **category** (gold tasca, cobalt wine bar, céu seafood…), over porcelain.
- Result: every card carries a distinct, colourful, unmistakably-Portuguese "image" with zero data and zero network — and it reinforces the brand instead of fighting it.
- Needs a new dependency: **`react-native-svg`** (Expo-SDK-52 supported, works on web via react-native-web). Alternative if we want zero new deps: build motifs from plain `View`s/borders — uglier, so SVG is recommended.
- Future (out of scope): a user may attach a real photo for places they've visited, which would replace the tile. The tile is the permanent fallback.

## Per-screen application

- **Home:** cobalt hero band carrying a tile pattern + white Archivo `PAPAZ` wordmark with a gold accent mark; search field on porcelain; Top-rated carousel cards gain tile thumbs + gold score pills; Explore chips become confident cobalt/gold pills; one motion moment = staggered entrance of the Top-rated cards (reduced-motion disables it). Keep the existing always-populated + engagement band structure.
- **List:** cobalt header treatment; rows gain a tile thumb, gold score, bookmark toggle inline; restyle the sort chips and the `/filters` sheet.
- **Restaurant detail (UX focus):** a cobalt tile **hero band** behind the name; a richer **Overview** that is the primary surface — consensus (gold numerals) + source bars, your rating + visited/bookmark quick-toggles, maps/website actions, and at-a-glance counts linking to Dishes/Wine/Notes so you seldom need to switch tabs. Restyle the top-tab bar. Dishes/Wine/Notes inherit the system.
- **Bookmarks / Add / Filters / Edit:** apply tokens, chips, buttons, tile thumbs, empty/error states.
- **Component kit** (`src/components/ui/*` + `CategoryBadge`, `PriceBadge`, `RestaurantCard`): restyle Card, Chip, Badge, ConsensusBadge (→ gold), Button, Stat, SectionHeader, EmptyState, ErrorState, Skeleton, RatingBar. This is where most screens inherit the look for free.

## Dependencies to add

- `@expo-google-fonts/archivo` (display font)
- `react-native-svg` (tile motifs) — unless we choose the View-only fallback

## What's left to the builder

- Exact Archivo weights/sizes for the type scale; the precise tile motif geometry and the category→tint map; the exact dark-mode hex set (verify AA); the motion timings. These are craft calls to make during build, screenshotting to review.
- Minimal-diff vs. rename for the `serif`→Archivo font keys.

## Success criteria (loop until verified)

1. All 7 screen areas + the component kit render in AZULEJO; no screen left on the cream/terracotta system (grep for stray old hexes).
2. `npm test` 90/90 pass; `npm run typecheck` clean.
3. `node docs/design/contrast.mjs` passes AA for the new palette (light + dark).
4. Web QA screenshots of Home, List, detail, Bookmarks, Add, Filters captured and visually reviewed; 0 console errors.
5. Reduced-motion disables the entrance animations; keyboard focus visible.
6. Reads as "cool, young, colourful, alive" — judged against the AZULEJO mockup.
