# Mesa — Design & UX Overhaul Plan

> **Audience:** a fresh Claude Code session (and the user) executing this in a new
> conversation. It is self-contained — you should not need to re-audit the app to start.
> **Working dir:** `/Users/I335997/FP_Labs/restaurant-app`
> **Stack:** Expo SDK 52, expo-router, NativeWind (Tailwind), React Query, Zustand, Drizzle.
> **Goal:** turn a feature-rich but visually thin app into a professional, cohesive,
> well-navigated product — add a Home/Discover landing, a real design system, and
> refined feature screens.

---

## 0. How to use this plan

1. **Direction is decided — see "Locked decisions" below.** Palette, color scheme, fonts,
   and the Add/filter nav model are chosen so a fresh session can start building
   immediately. The §2.1 alternatives remain documented fallbacks — switch only on user
   request.
2. Work the phases in §9 **in order**. Each phase has a success check — don't advance
   until it passes.
3. **Do not touch the data layer.** `src/db/*`, `src/scoring/*`, `src/domain.ts`, and the
   repo API are rich and working. This is a presentation-layer overhaul only.
4. **The design spec is the baseline of record.** `src/theme/tokens.ts` was derived
   "verbatim from spec §9". We are *evolving* it, not discarding it. Any deliberate
   divergence from the spec (palette, fonts, …) must be recorded in the **Spec deltas**
   log (§8.4) — never diverge silently.
5. **Accessibility (WCAG 2.1 AA) is a hard gate, not polish** (§2.3). A palette pairing
   that fails AA cannot be locked in Phase 0; a primitive without a label/role/44pt target
   is not done.
6. **Keep the test suite green within every phase** (§8.3). If a token or primitive change
   breaks a coupled test, fix the test in the *same* phase — the suite is never red across
   a phase boundary.

**Locked decisions** (change only on user request):
- **Palette:** Warm Terracotta (§2.1).
- **Default color scheme:** `system`, with light as the authored hero theme (§3.2).
- **Typography:** Fraunces (display) + Inter (body) — deliberate spec delta (§2.2, §8.4).
- **Add flow:** Add is a tab hosting the form; Edit + the filter sheet are modals (§5, §6.4).
- **Filter sheet (`/filters`):** committed, not optional (§6.2).

---

## 1. Current state (audit result — no need to re-verify)

**Data layer — rich, keep as-is.** Restaurants, consensus scoring across sources
(google/thefork/tripadvisor/reddit/personal), bookmarks with sub-filters, dishes, wines
(grouped by type), visits, personal ratings, editorial signals, location/distance.
Repo API in [src/db/repo.ts](src/db/repo.ts) covers the list/detail/CRUD surfaces. **Gap
to note:** it has no *global* recent-visits query (`getVisits` is per-restaurant), and the
seed writes no bookmarks/visits and a single shared `created_at` — so engagement-derived
Home modules have no data on a fresh install (see §6.1).

**UI layer — thin, the target of this work.**
- 3 tabs: My List · Bookmarks · Add. App opens straight into a dense filter list.
- No Home/Discover landing. No stats/insights surface. No map entry point.
- Flat white cards, no imagery, minimal hierarchy, no empty-state personality.
- `src/theme/tokens.ts` defines good tokens (dark-first, amber `#E8A838` accent,
  category colors, 4pt grid, radius scale) **but screens bypass it** with raw Tailwind
  classes, and the pill-filter pattern is duplicated — a `Chip` component in
  [list.tsx](app/(tabs)/list.tsx) and an equivalent *inline `Pressable`* in
  [bookmarks.tsx](app/(tabs)/bookmarks.tsx). No shared primitive kit.

**Libraries present:** expo-font, expo-asset, reanimated, gesture-handler, location,
@expo/vector-icons (Ionicons).
**Not installed (plan adds them):** `expo-image`, a map view, `expo-haptics`,
optionally `clsx`/`tailwind-merge` for a `cn()` helper.

---

## 2. Design direction

**Principle (the transferable idea behind the mkdocs pointer):** commit to ONE cohesive
theme — tokens + primitives — up front. Every screen then composes existing primitives,
which guarantees visual consistency. This is the most impactful decision in the plan.

What makes dining apps (Resy, Beli, The Infatuation, Michelin Guide) feel premium:
*editorial restraint* — generous whitespace, one strong accent on a near-neutral base,
large rounded photo cards, a serif-display + clean-sans type pairing. Avoid the loud
red/yellow of delivery apps (reads transactional).

### 2.1 Palette — DECIDED: Warm Terracotta

**Warm Terracotta** — chosen for a warm, editorial, non-transactional identity that fits a
Lisbon dining guide (Portuguese-tile warmth). A light-hero palette:

| Role | Light | Dark |
|------|-------|------|
| base (bg) | `#FAF7F2` | `#0C0A09` |
| surface | `#FFFFFF` | `#1C1917` |
| ink (text primary) | `#1C1917` | `#FAFAF9` |
| muted (text secondary) | `#78716C` | `#A8A29E` |
| accent | `#C2410C` (burnt orange) | `#EA580C` |
| secondary | `#0F766E` (teal) | `#2DD4BF` |
| danger | `#DC2626` | `#F87171` |

**Alternatives (documented fallbacks — switch only on user request):**
- **Michelin Noir** — dark-first luxe: base `#0C0A09`, surface `#1C1917`, ink `#FAFAF9`,
  accent `#D4AF37` gold, muted `#A8A29E`. *Closest to the app's existing amber/dark tokens
  — pick this if the user prefers evolving over re-skinning.*
- **Coastal Fresh** — bright/clean: base `#F8FAFC`, ink `#0F172A`, accent `#0D9488`,
  warm pop `#EA580C`.

**Category colors — give each its own hue, NOT reused for accent/secondary/muted.** On the
seed data 91% of rows are `other`, so `other` must be a legible neutral (not the muted
*text* grey) and ideally relabelled. Do **not** set `tasca = accent`: the accent is the
primary action/link color and the consensus badge already paints accent on the same card —
that collision makes category meaningless. Reserve a dedicated **consensus-badge token**
(neutral/ink, distinct from accent) so the score chip never clashes with a category.

### 2.3 Accessibility — WCAG 2.1 AA, baked in (hard gate)

Accessibility is a first-class design input here, not a Phase-6 afterthought.

- **Contrast (AA):** every text/background pairing must clear **4.5:1** (normal) / **3:1**
  (large ≥18pt or 14pt-bold). Verify all four pairings per chosen palette —
  text-on-base, text-on-surface, text-on-accent, muted-on-base — in Phase 0.
- **Accent is mode-aware, not a blanket flip.** For Warm Terracotta: light accent
  `#C2410C` gives black ~4.06:1 (**fails**) / white ~5.18:1 (passes); dark accent `#EA580C`
  is the reverse — black ~5.90:1 (passes) / white fails. So accent fills (consensus badge,
  active `Chip`, primary `Button`) use **white text in light mode, near-black in dark
  mode**. Encode this once in the `Button`/`Chip`/`Badge` primitives.
- **Muted text:** light `muted` `#78716C` on base `#FAF7F2` is ~4.49:1 (**just under AA**).
  Darken it (e.g. `#6B6B6B` → verify) or restrict `muted` to surface/white backgrounds.
- **Labels & roles:** every interactive primitive sets `accessibilityRole` +
  `accessibilityLabel`. Icon-only controls (bookmark toggle, `StarPicker`, maps/website
  links) get explicit labels — they have none today.
- **Touch targets:** minimum **44×44pt** (iOS HIG). `StarPicker`'s ~14px star zones need
  `hitSlop` to reach it without changing the visual.
- **Dynamic Type:** use scalable text (`allowFontScaling` on), avoid fixed-height clipping,
  and cap the serif display's max scale so large-text users don't break card layouts.

### 2.2 Typography

> **Decision (deliberate spec delta — logged in §8.4):** the spec says "System font… no
> custom font loading." We override it: a custom editorial type pairing is the core of the
> "professional/premium" look the goal asks for. We accept the spec's startup concern and
> mitigate it (bundle fonts locally via `expo-asset`, preload with `expo-font`, gate the
> first render so there's no flash of unstyled text).

- **Display/titles:** a humanist serif — **Fraunces** (recommended), Playfair Display, or
  Libre Baskerville. Loaded via `expo-font`.
- **Body/UI:** **Inter** (or General Sans).
- Add a `fontsLoaded` render gate in [app/_layout.tsx](app/_layout.tsx) — **none exists
  today**; seeding currently runs in a bare `useEffect` with no gate. Combine the font gate
  with the DB-ready gate added for web (§ web preview).
- Add a `fontFamily` token so titles are `font-serif` and body is `font-sans`.
- Confirm legibility of the serif at small card sizes — if it reads poorly below ~15pt,
  restrict the serif to headings/hero only and keep card titles in the sans.

---

## 3. Design system (tokens + dark mode + helper)

**3.1 Move tokens into `tailwind.config.js`** under `theme.extend` so call sites use
semantic class names, never raw hex:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      base:    { DEFAULT: '#FAF7F2', dark: '#0C0A09' },
      surface: { DEFAULT: '#FFFFFF', dark: '#1C1917' },
      ink:     { DEFAULT: '#1C1917', dark: '#FAFAF9' },
      muted:   { DEFAULT: '#78716C', dark: '#A8A29E' },
      accent:  { DEFAULT: '#C2410C', dark: '#EA580C' },
      secondary:{ DEFAULT: '#0F766E', dark: '#2DD4BF' },
    },
    borderRadius: { card: '16px', badge: '8px', button: '12px', pill: '9999px' },
    fontFamily: { serif: ['Fraunces'], sans: ['Inter'] },
  },
}
```

Usage pattern: `className="bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark"`.
Keep `src/theme/tokens.ts` as the JS-side source of truth for values that must be read in
code (e.g. passing a color to an Ionicon `color` prop) — re-point it to the new palette so
config and tokens never drift.

**3.2 Dark mode:** set `darkMode: 'class'` in config; drive the class from
`useColorScheme()` (from `nativewind`). **Footgun:** with `'class'` mode NativeWind renders
**light until `setColorScheme()` is called** — the class is inert on its own, and
`app/_layout.tsx` sets nothing today. So add a boot-time `setColorScheme(...)` alongside
the font/DB gate.
**Default scheme (DECIDED):** default to **`'system'`** (respect the OS),
with **light as the authored hero theme** for Warm Terracotta — its tile-warmth is a
light-palette story, and its dark column is near-identical to Michelin Noir, so booting
dark would erase what makes it distinctive. If the user instead picks a dark-luxe identity,
switch to **Michelin Noir + default dark** (the coherent pairing). Either way, both schemes
must pass the §2.3 contrast gate.

**3.3 `cn()` helper:** add `src/utils/cn.ts` wrapping `clsx` + `tailwind-merge` for
variant composition in primitives. (Install `clsx tailwind-merge`, or use `cva`.)

---

## 4. Component primitive kit

Create `src/components/ui/` with small, composable primitives. **Replace the duplicated
inline `Chip` first** — it proves the pattern and removes real duplication.

| Primitive | Purpose | Notes |
|-----------|---------|-------|
| `Button` | primary / secondary / ghost variants, sizes | `cn()`/`cva` variants; mode-aware accent fg (§2.3); 44pt min |
| `Chip` | filter/sort toggles | replaces the `Chip` in list.tsx **and the inline `Pressable` chip in bookmarks.tsx** |
| `Card` | rounded surface container | `rounded-card`, shadow token, dark pair |
| `Badge` | small status/label | wrap existing CategoryBadge/PriceBadge; consensus badge uses its own neutral token |
| `SectionHeader` | title + optional "See all" action | for Home carousels |
| `EmptyState` | icon + headline + body + optional CTA | the *success-but-no-data* state |
| `Skeleton` | shimmer placeholder matching card/list shape | the *loading* state — prevents empty-state flash |
| `ErrorState` | icon + message + retry button | the *failed-read* state; retry calls React Query `refetch` |
| `Stat` | big number + label | Home stat strip |
| `Rating` | **keep two widgets** — don't force-merge | `StarPicker` = 0.5-step star *input* (preserve its `star-{i}-half/full` testIDs); `RatingBar` = multi-source consensus *display* with empty guard. Only unify if both APIs are preserved. |
| `ScreenContainer` | SafeAreaView + base bg + padding | removes repeated boilerplate |

**Four-state model (every data-backed view):** React Query already gives
`isLoading`/`isError`/`refetch`. Render: `isLoading` → `Skeleton`; `isError` → `ErrorState`;
success + empty → `EmptyState`; success + data → content. Never let a slow read flash the
empty state (screens default reads to `[]` today and read neither flag).

**Accessibility is baked into primitives, not screens** — `accessibilityRole`/`Label`,
44pt targets, and mode-aware accent foreground live in the primitive so every consumer
inherits them (§2.3).

Keep Ionicons as the icon set (consistent, installed).

---

## 5. Navigation structure

Target hierarchy: **Tabs → Stack per tab → Modals for interruptions.** 4 tabs (iOS HIG
sweet spot).

```
app/
  _layout.tsx                 # root: fonts + db gate, Stack, modal registration
  index.tsx                   # redirect → /(tabs)/home   (currently → /list)
  (tabs)/
    _layout.tsx               # 4 tabs: Home · List · Bookmarks · Add
    home.tsx                  # NEW — Discover/landing (see §6)
    list.tsx                  # refine (compose primitives, move filters to sheet)
    bookmarks.tsx             # refine (use primitives, EmptyState)
    add.tsx                   # Add tab — hosts RestaurantForm directly (Edit is the modal)
  restaurant/
    [id]/_layout.tsx          # material top tabs: overview/dishes/wine/notes (keep)
    [id]/*.tsx                # refine each with primitives
    edit/[id].tsx             # modal (presentation: 'modal' already)
  filters.tsx                 # NEW — filter sheet (presentation: 'formSheet')
```

- **Tab** = top-level destination. **Stack push** = drill-down (restaurant detail).
- **Modal** = the Edit form and the filter sheet (`presentation: 'modal'` / `'formSheet'`).
  Add is a full tab screen, not a modal.
- Update `app/index.tsx` redirect target from `/list` to `/home`.

---

## 6. Screen specs

### 6.1 Home / Discover — NEW (highest-impact addition)

**Design for the first-run (zero-engagement) state as a first-class state.** On a fresh
install there are **no bookmarks, no visits, and a flat `created_at`**, so engagement-derived
modules are empty. Compose Home in two bands:

**Always-populated band (built from the 225 seeded restaurants — these always exist):**
1. **Hero** — greeting + prominent search bar. (Greeting copy via a tiny helper, not a
   hardcoded Portuguese string — see i18n note below.)
2. **Explore / Featured** — a populated carousel drawn from the catalogue (e.g. by
   category or price), so Home is never blank. This replaces a recency-sorted "Recently
   added" carousel, which is meaningless while `created_at` is flat.
3. **Quick-filter entry** — category / price / zone-cluster chips → deep-link into a
   pre-filtered List. (Avoid leading with Tasca/Cervejaria/Marisqueira alone — they're
   <10% of data; include a prominent "All" / price / zone-cluster path.)

**Engagement band (renders as onboarding nudges when empty — turns a blank into guidance):**
4. **Stat strip** — Visited / Bookmarked / To-try. When all zero, show a one-line
   onboarding prompt ("Bookmark places you want to try") instead of `0 · 0 · 0`.
5. **Want to try** — bookmarked cards, or an `EmptyState` CTA when none.
6. **Recent visits & notes** — latest visits with notes, or an `EmptyState` CTA.
   ⚠️ repo.ts has **no global recent-visits query** (only `getVisits` per restaurant). This
   is the one sanctioned data-layer touch: add a read-only `listRecentVisits(db, limit)` —
   log it in §8.4. (Do **not** silently loop `getVisits` over every restaurant.)
7. **Map entry point** — card → Lisbon map/zone view (native; web falls back to a zone
   list, §8).

**Each module owns its loading/error/empty state independently** (§4 four-state model): a
failed "recent visits" read shows an inline `ErrorState` in that module only; the rest of
Home still renders.

**Seed enrichment (content-only, sanctioned):** to make the preview look alive, add a few
bookmarks + a couple of visits-with-notes and vary `created_at` in the seed. This is demo
*content*, not schema/scoring — allowed, and logged in §8.4. Home must still behave for a
genuinely empty DB (new user), hence the nudges above. ⚠️ On **native/Expo Go** you must
clear app data for re-seeding to take effect (§8.5); **web preview** re-seeds every reload.

**Unscored restaurants:** the explore/featured/"top" rails must treat `consensus = null` as
*unscored* (never 0) and still surface those spots in plain browsing — at least 5 exist
permanently (§8.5).

**Keep it to ~4–5 modules with a clear focal point** (hero + one populated carousel + one
entry row); gate the rest on having data rather than stacking seven thin sections.

### 6.2 My List — refine
Keep FlatList + data logic. Swap inline Chip → `Chip` primitive; move the 4 filter rows
into a **filter sheet** (`/filters` modal) triggered by a filter button, so the list
breathes. Apply the four-state model (§4): `Skeleton` list rows on first load (not the
empty-state flash), `ErrorState` on read failure, `EmptyState` only on success-with-no-data.

### 6.3 Bookmarks — refine
Use `Chip` + `ScreenContainer` + four-state model (§4). Visually consistent with List.

### 6.4 Add — tab
The Add **tab** hosts `RestaurantForm` directly (matches the current structure — minimal
change). Group fields into sections with `SectionHeader`; use `Button` variants for
save/cancel; on submit, dismiss to the new restaurant's detail (or back to List). Edit
stays a modal (§5).

### 6.5 Restaurant detail — refine
Keep the material top tabs. Add a header area (name in `font-serif`, zone, category/price
badges, consensus number prominent). Apply primitives across overview/dishes/wine/notes.
Make map/website links `Button` ghosts, not raw amber text.

---

## 7. Dependencies to add

```bash
npx expo install expo-haptics
npm install clsx tailwind-merge            # for cn(); or `npm install class-variance-authority`
# Map (choose in execution): `npx expo install react-native-maps`  (native)
#   — note: react-native-maps has limited web support; gate behind Platform or defer map to a zone list on web.
# expo-image is intentionally NOT here — there is no image field in the data model yet (§10).
```

Fonts: add Fraunces + Inter `.ttf` to `assets/fonts/`, load via `expo-font` (spec delta §8.4).

---

## 8. Cross-cutting standards & constraints

### 8.1 Platform constraints (carry over from current session)
- **Web preview** runs on sql.js **without FTS5** — text search is a no-op on web (handled
  gracefully in `searchIds`). Fine for preview; native has full search.
- `react-native-maps` is native-first. On web, either gate the map behind
  `Platform.OS !== 'web'` or render a zone list fallback. Don't block the Home page on it.
- There is a pre-existing NativeWind dark-mode console warning on web — unrelated, ignore.

### 8.2 Copy & i18n
Content strings (the Home greeting, empty-state CTAs, section titles) go through a single
small copy helper/module, not inline literals. The greeting is time-based ("Bom dia /
Boa tarde / Boa noite") — compute it, don't hardcode one value. This keeps a future
locale switch cheap without pulling in an i18n framework now (that would be speculative).

### 8.3 Testing & regression strategy
The restyle touches tokens and consolidates components; several existing tests are coupled
to literals and testIDs. Protect against silent breakage proportionally — cheap, high-value
only:
- **Suite green within every phase (§0.6).** Any token/primitive change that breaks a test
  is fixed in the *same* phase. Known couplings to handle up front:
  [CategoryBadge.test.tsx](src/components/__tests__/CategoryBadge.test.tsx) asserts
  `tokens.category.tasca === '#E8A838'` (breaks the instant `tokens.ts` is retuned);
  `StarPicker`/`RatingBar` tests assert specific testIDs (preserve them when building the
  `Rating` primitives).
- **Decouple assertions from literals** — assert against the token, not the hex, so future
  palette retunes don't cascade into test edits.
- **Snapshot-test the primitive kit** (`@testing-library/react-native` `toJSON()`): cheap
  markup/style-drift guard for the shared `src/components/ui/*`. Render each in light + dark.
- **Per-phase manual visual QA checklist** (the plan verifies "by eye" — make it explicit):
  screenshot Home · List · detail in **both** themes, check against the design intent and
  the §2.3 contrast gate. The current session's Playwright web-preview flow is the vehicle.
- **Deferred (do not build now):** full pixel-diff visual regression (Storybook + Loki /
  Chromatic). Overkill at this stage — snapshot tests + the manual checklist are the right
  altitude. Reconsider only if the UI churns frequently later.

### 8.4 Spec deltas (log every deliberate divergence from the design spec)
The spec is the baseline of record (§0.4). Record each override here so the two never drift
silently:

| # | Spec says | Plan does | Why |
|---|-----------|-----------|-----|
| 1 | System font, no custom loading (startup/native feel) | Custom Fraunces + Inter, preloaded + gated | Editorial type is core to the "premium" goal; startup mitigated by local bundle + render gate |
| 2 | Palette per spec §9 (dark-first amber) | Retuned palette (Warm Terracotta / alt), semantic tokens | Cohesive modern system; existing tokens bypassed in practice |
| 3 | Data/repo layer frozen | One read-only add: `listRecentVisits(db, limit)` for Home §6.1.6 | No global recent-visits query exists; the only clean way to serve that surface |

Add a row whenever execution diverges from the spec again; if a spec doc is maintained,
mirror the delta there.

### 8.5 Data & seed caveats (real, verified)
- **Some restaurants are permanently unscored.** At least 5 out-of-Lisbon spots —
  **Intemporal, Mar Azul 2, Atrevo, Retiro do Capitanga, Baco Coffee Lab** — have no
  ratings (their research never completed; the research agents hit repeated 502s). They
  render with `consensus = null`: no score badge ([RestaurantCard.tsx:27](src/components/RestaurantCard.tsx#L27)),
  consensus section hidden ([overview.tsx:60](app/restaurant/[id]/overview.tsx#L60)), and
  they sink to the bottom of consensus-sort ([repo.ts:190](src/db/repo.ts#L190), already
  null-safe). **Any new consensus-driven UI** (Home "explore/featured", stat leaders, a
  "top rated" rail) must treat null as *"unscored"* — never `0` — must not crash, and must
  not hide these from plain browsing. Consider an explicit "Unscored" affordance so they
  don't just look like bottom-ranked.
- **Seed loads on a fresh DB only.** `seedIfEmpty` inserts nothing and returns 0 when the
  restaurants table already has rows ([seed.ts:12](src/db/seed.ts#L12)). Implications for
  verification:
  - **Expo Go / native (persistent expo-sqlite):** to see the 225 — and especially the
    §6.1 seed enrichment (bookmarks/visits/varied `created_at`) — you must **clear the
    app's data first**; otherwise the already-populated DB is kept and your seed changes
    never run.
  - **Web preview (sql.js, in-memory):** `client.web.ts` builds a fresh in-memory DB on
    every load, so the seed re-runs each reload — seed changes appear immediately, no
    clearing needed. Use web preview for fast seed/visual iteration; confirm persistence
    behavior separately on native.

---

## 9. Phased execution roadmap

Each phase ends with a **success check**. Loop until it passes before advancing.
Verify in the browser preview (`npx expo start`, open `http://localhost:8081`) AND keep
the test suite green (`npm test`) **within the phase** (§8.3). Run the §8.3 manual visual
QA checklist at the end of every UI phase.

**Phase 0 — Lock tokens (decisions already made — see "Locked decisions").** Palette =
Warm Terracotta, scheme = system/light, fonts = Fraunces + Inter. Validate every pairing
against the §2.3 AA contrast gate, then enter values in `tailwind.config.js` + `tokens.ts`.
✅ *Check:* AA verified for all pairings in light + dark; tokens entered; **coupled tests
updated in this phase** (CategoryBadge hex → assert via token) so `npm test` stays green.

**Phase 1 — Design system foundation.** Tailwind tokens (incl. dedicated consensus-badge
token), `darkMode: 'class'` + boot-time `setColorScheme` (§3.2), `cn()` helper, fonts
loaded with a `fontsLoaded` render gate. ✅ *Check:* a throwaway screen using `bg-base`,
`text-ink`, `font-serif` renders correctly in light + dark; no flash of unstyled text.

**Phase 2 — Primitive kit.** Build `src/components/ui/*` (§4) with a11y + mode-aware accent
baked in. Replace the list.tsx `Chip` **and the inline `Pressable` chip in bookmarks.tsx**.
Add `Skeleton`/`ErrorState`/`EmptyState`. ✅ *Check:* list + bookmarks render via the shared
`Chip` (no inline Pressable chip remains); primitive snapshot tests pass in both themes;
`StarPicker`/`RatingBar` testIDs preserved; `npm test` green.

**Phase 3 — Navigation.** Add the Home tab (4 total: Home · List · Bookmarks · Add), create
`home.tsx` placeholder, repoint `index.tsx` → `/home`, make Edit + `/filters` modals. ✅
*Check:* all 4 tabs reachable; `/` lands on Home; Edit + filter sheet present as modals;
Add is a working tab; no "Unmatched Route".

**Phase 4 — Home/Discover.** Build §6.1 — always-populated band first, engagement band with
onboarding-nudge empty states, per-module four-state handling, the sanctioned
`listRecentVisits` read (log in §8.4), and seed enrichment. ✅ *Check:* Home looks alive on
BOTH a seeded DB and a manually-emptied DB (nudges, no `0·0·0`, no blank modules); quick
filters deep-link into a pre-filtered List.

**Phase 5 — Refine feature screens.** Apply primitives + four-state model to List
(+ filter sheet), Bookmarks, Add, Restaurant detail (§6.2–6.5). Add `accessibilityLabel`/
role + 44pt targets to icon-only controls (bookmark, stars, maps/website). ✅ *Check:* every
screen uses primitives; no raw hex / duplicated styling; loading/error/empty states correct;
AA contrast holds; visually consistent light + dark.

**Phase 6 — Polish.** Haptics on key actions, subtle reanimated transitions, consistent
spacing pass, Dynamic-Type spot check at large text sizes. ✅ *Check:* run the app, click
through every screen, screenshot Home + List + detail in both themes; looks cohesive and
premium; no layout break at larger font scales. *(`expo-image` is NOT included — see §10.)*

---

## 10. Out of scope / deferred

- Backend/live rating fetch (Google/Reddit) — Slice 2 per the app's own spec.
- Auth, sync, multi-user.
- Native map polish on web (zone-list fallback is enough for preview).
- **`expo-image` and any photo/thumbnail UI** — no image field exists in the data model;
  adding the library now is speculative. Reintroduce only when an image field is added
  (that's a data-model change, itself out of scope here).
- **Full pixel-diff visual regression infra** (Storybook + Loki/Chromatic) — snapshot tests
  + the §8.3 manual checklist are the right altitude for now.
- Don't refactor the data/scoring layer — presentation only, except the single sanctioned
  read-only `listRecentVisits` query logged in §8.4.

---

## Sources (inspiration + confirmed docs)

- Expo Router tabs — https://docs.expo.dev/router/advanced/tabs/
- Expo Router modals — https://docs.expo.dev/router/advanced/modals/
- NativeWind theming / dark mode — https://www.nativewind.dev
- Mobbin (Resy/OpenTable/Beli flows) — https://mobbin.com/apps
- The Infatuation (editorial restaurant UI) — https://theinfatuation.com
- Michelin Guide (dark luxe aesthetic) — https://guide.michelin.com
- Fraunces serif — https://fonts.google.com/specimen/Fraunces
- cva (variant management) — https://cva.style/docs
