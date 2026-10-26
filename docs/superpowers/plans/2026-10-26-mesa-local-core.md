# Mesa — Local Core Implementation Plan (Vertical Slice 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable offline-first Mesa app (Expo Go) that stores, browses, filters, searches, and annotates a personal Lisbon restaurant registry entirely from on-device SQLite.

**Architecture:** Expo Router file-based app over a Drizzle/expo-sqlite data layer. Pure logic (distance, rating normalization, filter/sort) lives in `src/utils` and is unit-tested TDD-first. Data access is funneled through typed repository functions in `src/db/repo.ts`, surfaced to screens via TanStack Query hooks; ephemeral UI state (active filters/sort) lives in a Zustand store. External APIs (Google Places, Reddit) and the native map are **out of scope** here but the repository and an empty `src/api/` seam are shaped so they drop in during Vertical Slice 2 with no screen rework.

**Tech Stack:** React Native + Expo SDK 52 (TypeScript), Expo Router, expo-sqlite + Drizzle ORM, Zustand, TanStack Query, NativeWind, jest-expo + @testing-library/react-native.

**Spec:** `docs/specs/2026-08-28-restaurant-app-design.md` (the plan argues from this spec; executors read both).

## Global Constraints

- Expo SDK **52**, TypeScript, Node ≥ 18 (dev machine is Node 22). Copied from spec §3.
- All personal data persists to on-device SQLite only — no backend, no auth. Spec §1.
- Schema is **exactly** spec §6 (table/column names, types, indexes, FTS5). Do not rename columns.
- Score normalization is **exactly** spec §6: Google `×2`, TheFork as-is (0–10), TripAdvisor `×2`, Personal `×2`. Stored normalized to 0–10.
- Design tokens (colors, spacing 4pt grid, radius) are **exactly** spec §9. Dark-mode first, light supported.
- Category enum: `'tasca' | 'cervejaria' | 'marisqueira' | 'other'`. Price enum: `'€' | '€€' | '€€€' | '€€€€'`. Spec §6.
- IDs are UUID v4 (`expo-crypto` `randomUUID`). Timestamps are ISO 8601 strings.
- **Deferred to Slice 2 (do NOT build here):** Nearby *map* screen (react-native-maps needs a dev build), Google Places autocomplete + details, Reddit search, the detail **Reviews** tab's live sources, EAS Ad Hoc build, EAS Update. The `Add` flow here is **manual entry only** (no autocomplete).
- **Content dependency:** the full curated 28-restaurant dataset with pre-geocoded coords + manual TheFork/TripAdvisor scores (spec §10) is user-supplied. Task 5 ships the seed *machinery* + a small clearly-marked sample; full data lands later via the same typed array.

## Review Focus

Inputs/failure modes the spec implies but no happy-path test exercises, most likely to bite first:

1. **Location permission denied** — per spec §7.1 the app must still function: list sorted alphabetically, distance hidden. Pinned in Task 6 (distance hook returns `null` location gracefully) and Task 8 (sort falls back when no location).
2. **Deleting a restaurant with children** — ratings/dishes/wines/visits must cascade (spec §6 `ON DELETE CASCADE`). Pinned in Task 3 (foreign-keys PRAGMA on) and Task 14 (delete test asserts children gone).
3. **FTS search with empty / punctuation / accented query** (e.g. "Ourique", "O Zé") — must not crash and must match accented seed names. Pinned in Task 7.
4. **Consensus bar when some sources are missing** — a restaurant with only a personal rating, or none, must render without NaN/`÷0`. Pinned in Task 10.
5. **Re-running the seed on an already-seeded DB** — must be idempotent (spec §10 "checks if table is empty"); a second launch must not duplicate rows. Pinned in Task 5.

---

### Task 1: Project scaffold + tooling

**Files:**
- Create: `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`, `nativewind-env.d.ts`, `.gitignore`, `.env.local.example`
- Create: `app/_layout.tsx` (root Stack + QueryClientProvider), `app/(tabs)/_layout.tsx` (bottom tabs stub), `app/(tabs)/list.tsx` (placeholder "Mesa" screen)
- Create: `jest.config.js`, `jest.setup.ts`
- Test: `src/utils/__tests__/smoke.test.ts`

**Interfaces:**
- Produces: a booting Expo Router app with tabs **My List · Bookmarks · Add (+)** (Nearby tab added in Slice 2); npm scripts `start`, `test`, `typecheck`, `lint`; path alias `@/*` → `src/*`.

- [ ] **Step 1:** Run `npx create-expo-app@latest . --template blank-typescript` in the repo root (keep existing `docs/`), then install deps: `expo-router expo-sqlite drizzle-orm zustand @tanstack/react-query nativewind tailwindcss expo-crypto expo-location expo-web-browser expo-linking @expo/vector-icons` and dev deps `drizzle-kit jest-expo @testing-library/react-native @types/jest`.
- [ ] **Step 2:** Configure Expo Router (entry `expo-router/entry`, `scheme` in app.json), NativeWind (babel plugin, metro, `global.css`, `tailwind.config.js` content globs), path alias in `tsconfig.json`, and jest preset `jest-expo` with `jest.setup.ts`.
- [ ] **Step 3:** Write `src/utils/__tests__/smoke.test.ts` — `test('tooling works', () => expect(1+1).toBe(2))`.
- [ ] **Step 4:** Run `npm test` → PASS; run `npm run typecheck` (`tsc --noEmit`) → clean.
- [ ] **Step 5:** Run `npx expo start` long enough to confirm it bundles without error (Ctrl-C after "Bundled").
- [ ] **Step 6:** Commit: `chore: scaffold Expo Router + NativeWind + jest`.

---

### Task 2: Design tokens + shared badges

**Files:**
- Create: `src/theme/tokens.ts`, `src/components/CategoryBadge.tsx`, `src/components/PriceBadge.tsx`
- Test: `src/components/__tests__/CategoryBadge.test.tsx`

**Interfaces:**
- Produces: `tokens` (colors/spacing/radius objects matching spec §9); `<CategoryBadge category={Category} />`, `<PriceBadge price={PriceRange} />`. Category/price color map from spec §9.

- [ ] **Step 1:** Write `CategoryBadge.test.tsx` — renders label "Tasca" and applies amber token for `category="tasca"`; renders "Cervejaria" for `cervejaria`.
- [ ] **Step 2:** Run test → FAIL (component missing).
- [ ] **Step 3:** Implement `tokens.ts` (verbatim values from spec §9) and the two badge components using NativeWind classes driven by the token map.
- [ ] **Step 4:** Run test → PASS.
- [ ] **Step 5:** Commit: `feat: design tokens + category/price badges`.

---

### Task 3: Database init + Drizzle schema

**Files:**
- Create: `src/db/schema.ts` (Drizzle table defs for all 5 tables + FTS virtual table), `src/db/index.ts` (open DB, enable `PRAGMA foreign_keys = ON`, run migrations), `drizzle.config.ts`
- Create: `src/db/migrations/` (generated)
- Test: `src/db/__tests__/schema.test.ts`

**Interfaces:**
- Produces: `getDb(): ExpoSQLiteDatabase` (singleton), and exported typed tables `restaurants, ratings, dishes, wines, visits`. Column names/types **exactly** spec §6. Types `Category`, `PriceRange`, `RatingSource`, `WineType` exported from `schema.ts`.

- [ ] **Step 1:** Write `schema.test.ts` using an in-memory/temp SQLite db: after init, inserting a restaurant then a rating referencing it succeeds; `PRAGMA foreign_keys` returns 1; deleting the restaurant removes the rating (cascade).
- [ ] **Step 2:** Run test → FAIL.
- [ ] **Step 3:** Implement `schema.ts` (map spec §6 SQL to Drizzle), `index.ts` (open via `expo-sqlite`, enable FK pragma, apply migrations), generate migrations with `npx drizzle-kit generate`.
- [ ] **Step 4:** Run test → PASS (cascade + FK assertions).
- [ ] **Step 5:** Commit: `feat: sqlite schema + drizzle migrations`.

---

### Task 4: Pure utils (TDD)

**Files:**
- Create: `src/utils/haversine.ts`, `src/utils/normalizeRating.ts`, `src/utils/formatDistance.ts`
- Test: `src/utils/__tests__/{haversine,normalizeRating,formatDistance}.test.ts`

**Interfaces:**
- Produces: `haversineKm(a: {lat:number;lng:number}, b: {lat:number;lng:number}): number`; `normalizeScore(source: RatingSource, raw: number): number` (0–10); `formatDistance(km: number): string` (e.g. `"650 m"`, `"1.2 km"`).

- [ ] **Step 1:** Write tests with spec values: `normalizeScore('google', 4.7) === 9.4`; `normalizeScore('thefork', 8.0) === 8.0`; `normalizeScore('tripadvisor', 4.0) === 8.0`; `haversineKm` between two known Lisbon points within 1% of a hand-checked value; `formatDistance(0.65) === '650 m'`, `formatDistance(1.2) === '1.2 km'`.
- [ ] **Step 2:** Run tests → FAIL.
- [ ] **Step 3:** Implement the three functions (standard Haversine; normalization table from spec §6).
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5:** Commit: `feat: haversine, rating normalization, distance formatting`.

---

### Task 5: Seed machinery (idempotent)

**Files:**
- Create: `src/db/seeds/lisbon-restaurants.ts` (typed array + small verified sample, each sample row marked `// SAMPLE — verify coords/scores`), `src/db/seed.ts`
- Test: `src/db/__tests__/seed.test.ts`

**Interfaces:**
- Consumes: Task 3 tables, Task 4 none.
- Produces: `SeedRestaurant` type (restaurant fields + optional `dishes`, `ratings` arrays); `seedIfEmpty(db): Promise<number>` returns rows inserted (0 if already seeded).

- [ ] **Step 1:** Write `seed.test.ts` — on empty db, `seedIfEmpty` inserts `sample.length` restaurants and returns that count; calling it a **second** time returns 0 and row count is unchanged (idempotency — Review Focus #5).
- [ ] **Step 2:** Run test → FAIL.
- [ ] **Step 3:** Implement `SeedRestaurant`, the sample array (3–5 well-known Lisbon places with approximate, clearly-flagged data), and `seedIfEmpty` (guard on `SELECT count(*) FROM restaurants`). Leave a header comment documenting how to extend to the full 28.
- [ ] **Step 4:** Run test → PASS.
- [ ] **Step 5:** Commit: `feat: idempotent seed loader + sample Lisbon data`.

---

### Task 6: Repository layer + location hook

**Files:**
- Create: `src/db/repo.ts`, `src/hooks/useLocation.ts`, `src/store/ui.ts`, `src/query/client.ts`
- Test: `src/db/__tests__/repo.test.ts`

**Interfaces:**
- Consumes: Task 3 tables, Task 4 utils.
- Produces (repo, all async, typed): `listRestaurants(opts: ListOpts): Restaurant[]` where `ListOpts = { sort: 'distance'|'rating'|'name'|'zone'; categories?: Category[]; prices?: PriceRange[]; visited?: 'visited'|'unvisited'|'all'; bookmarkedOnly?: boolean; search?: string; origin?: {lat,lng} }`; `getRestaurant(id)`, `createRestaurant(input)`, `updateRestaurant(id, patch)`, `deleteRestaurant(id)`, `setBookmark(id, bool)`, `setVisited(id, bool)`; children CRUD `addDish/deleteDish`, `addWine/deleteWine`, `addVisit/deleteVisit`, `setPersonalRating(id, score)`, `upsertManualScore(id, source, score, count, url)`. Zustand `useUiStore` holds `{ sort, filters }`. `useLocation()` returns `{ coords: {lat,lng} | null, status: 'granted'|'denied'|'undetermined', request() }`.

- [ ] **Step 1:** Write `repo.test.ts` against a seeded temp db: `listRestaurants({sort:'name'})` returns alphabetical; `{sort:'rating'}` puts unrated last; `{bookmarkedOnly:true}` filters; `{categories:['tasca']}` filters; `setBookmark` then re-list reflects it; `deleteRestaurant` removes it.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `repo.ts` (Drizzle queries; `distance` sort computed in JS via `haversineKm` when `origin` present, else falls back to name order — Review Focus #1), `useLocation` (expo-location foreground permission, returns `null` coords on denied — Review Focus #1), Zustand store, shared QueryClient.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: repository layer, UI store, location hook`.

---

### Task 7: My List screen

**Files:**
- Create: `src/components/RestaurantCard.tsx`, `app/(tabs)/list.tsx` (replace placeholder), `src/hooks/useRestaurants.ts`
- Test: `src/db/__tests__/search.test.ts`, `src/components/__tests__/RestaurantCard.test.tsx`

**Interfaces:**
- Consumes: Task 2 badges, Task 6 repo/store, Task 4 `formatDistance`.
- Produces: `useRestaurants()` (TanStack Query wrapping `listRestaurants` keyed on store filters/sort); `<RestaurantCard restaurant distanceKm? />`.

- [ ] **Step 1:** Write `search.test.ts` — FTS matches "Ourique" (zone), matches accented name "O Zé…" via `search:'ze'` or `'Zé'`, empty/whitespace query returns all, punctuation query does not throw (Review Focus #3). Write `RestaurantCard.test.tsx` — shows name/zone/category badge/price badge; greyed stars when `visited=0`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement FTS query path in `repo.listRestaurants` (sanitize query → FTS5 MATCH, fallback to all on empty), the card, the screen (FlatList + sort bar `Distance·Rating·Name·Zone` + filter drawer + search bar wired to `useUiStore`). Default sort: personal rating desc, unrated bottom alphabetical (spec §7.2).
- [ ] **Step 4:** Run → PASS. Manually confirm on Expo Go that list renders + search/filter work.
- [ ] **Step 5:** Commit: `feat: My List screen with search, sort, filters`.

---

### Task 8: Bookmarks screen

**Files:**
- Create: `app/(tabs)/bookmarks.tsx`
- Test: `src/db/__tests__/bookmarks.test.ts`

**Interfaces:**
- Consumes: Task 6 repo, Task 7 card. Produces: nothing new (reuses list rendering).

- [ ] **Step 1:** Write `bookmarks.test.ts` — "Want to Try" = `bookmarked && !visited`; "Visited & Loved" = `bookmarked && visited && personal_rating >= 4.0` (spec §7.3). Assert the predicate helper `bookmarkSubfilter(r, mode)`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `bookmarkSubfilter` in `repo.ts` and the screen (reuses `RestaurantCard`, pre-filtered `bookmarkedOnly`, sub-filter chips All/Want to Try/Visited & Loved).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: bookmarks screen with sub-filters`.

---

### Task 9: Add restaurant (manual entry modal)

**Files:**
- Create: `app/(tabs)/add.tsx`, `src/components/RestaurantForm.tsx`
- Test: `src/components/__tests__/RestaurantForm.test.tsx`

**Interfaces:**
- Consumes: Task 6 `createRestaurant`. Produces: `<RestaurantForm mode="add"|"edit" initial? onSubmit(input) />` returning the full restaurant input shape; validation requires `name`, `category`, `price_range`.

- [ ] **Step 1:** Write `RestaurantForm.test.tsx` — submit blocked until name/category/price present; valid submit calls `onSubmit` with the typed input incl. optional `thefork_url`/`tripadvisor_url`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement the form (name, address, zone, category picker, price picker, website, phone, TheFork/TripAdvisor URLs — all manual; **no** Google autocomplete) and the modal route that saves via `createRestaurant` and closes. 3-step feel optional; single scrollable form acceptable.
- [ ] **Step 4:** Run → PASS. Confirm on Expo Go: add a restaurant → appears in My List.
- [ ] **Step 5:** Commit: `feat: add restaurant (manual entry)`.

---

### Task 10: Detail layout + Overview tab

**Files:**
- Create: `app/restaurant/[id]/_layout.tsx` (top tab layout: overview·dishes·wine·my-notes — **reviews deferred**), `app/restaurant/[id]/overview.tsx`, `src/components/RatingBar.tsx`, `src/hooks/useRestaurant.ts`
- Test: `src/components/__tests__/RatingBar.test.tsx`

**Interfaces:**
- Consumes: Task 4 `normalizeScore`, Task 6 `getRestaurant`. Produces: `useRestaurant(id)`; `<RatingBar scores={{google?,thefork?,tripadvisor?,reddit?,personal?}} />` rendering only present sources.

- [ ] **Step 1:** Write `RatingBar.test.tsx` — with only `{personal:8}` renders one segment and no NaN; with `{}` renders an empty-state, not a crash (Review Focus #4); with multiple sources renders each.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `RatingBar` (guard against divide-by-zero / missing sources), `useRestaurant`, and Overview (name/zone/badges, address + "Open in Maps" via `expo-linking` to Apple/Google Maps, website via `expo-web-browser`, consensus `RatingBar` from stored ratings). Opening hours/photos (Google) omitted — Slice 2.
- [ ] **Step 4:** Run → PASS. Confirm navigation from a list card opens detail.
- [ ] **Step 5:** Commit: `feat: restaurant detail layout + overview tab`.

---

### Task 11: My Notes tab

**Files:**
- Create: `app/restaurant/[id]/my-notes.tsx`, `src/components/StarPicker.tsx`
- Test: `src/components/__tests__/StarPicker.test.tsx`

**Interfaces:**
- Consumes: Task 6 `setPersonalRating`, `addVisit`, `setVisited`, `setBookmark`. Produces: `<StarPicker value step={0.5} onChange />`.

- [ ] **Step 1:** Write `StarPicker.test.tsx` — tapping the 4th star calls `onChange(4.0)`; supports 0.5 increments (half-star tap → 3.5).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `StarPicker` and My Notes tab (personal rating picker → `setPersonalRating`; visit log list + add-visit modal with date + notes; "Mark as visited" and "Bookmark" toggles syncing `restaurants.visited`/`bookmarked`).
- [ ] **Step 4:** Run → PASS. Confirm a rating + note persists across app reload (Expo Go).
- [ ] **Step 5:** Commit: `feat: my-notes tab (rating, visits, toggles)`.

---

### Task 12: Dishes tab

**Files:**
- Create: `app/restaurant/[id]/dishes.tsx`
- Test: `src/db/__tests__/dishes.test.ts`

**Interfaces:**
- Consumes: Task 6 `addDish`, `deleteDish`, `getRestaurant`.

- [ ] **Step 1:** Write `dishes.test.ts` — `addDish` then list shows it with source badge; `deleteDish` removes it.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement Dishes tab (list with source badge, FAB → add modal name/description/source/must-try toggle, swipe-left delete).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: dishes tab`.

---

### Task 13: Wine tab

**Files:**
- Create: `app/restaurant/[id]/wine.tsx`
- Test: `src/db/__tests__/wines.test.ts`

**Interfaces:**
- Consumes: Task 6 `addWine`, `deleteWine`, `getRestaurant`.

- [ ] **Step 1:** Write `wines.test.ts` — `addWine` with `wine_type='red'` appears under the red group; grouping helper `groupWinesByType(wines)` returns a map keyed by type.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement `groupWinesByType` + Wine tab (grouped list, add modal name/type picker/region/producer/notes/personal toggle, swipe delete).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit: `feat: wine tab`.

---

### Task 14: Edit + delete restaurant

**Files:**
- Create: `app/restaurant/[id]/edit.tsx`; Modify: `app/restaurant/[id]/_layout.tsx` (kebab ⋮ header → edit)
- Test: `src/db/__tests__/delete-cascade.test.ts`

**Interfaces:**
- Consumes: Task 9 `RestaurantForm` (mode="edit"), Task 6 `updateRestaurant`, `deleteRestaurant`.

- [ ] **Step 1:** Write `delete-cascade.test.ts` — create restaurant + a rating + dish + wine + visit, `deleteRestaurant`, assert all children rows are gone (Review Focus #2).
- [ ] **Step 2:** Run → FAIL (if cascade regressed) or PASS structurally — ensure assertions cover every child table.
- [ ] **Step 3:** Implement edit route (reuse `RestaurantForm` pre-filled → `updateRestaurant`) and "Delete restaurant" with confirmation dialog → `deleteRestaurant` → navigate back.
- [ ] **Step 4:** Run → PASS. Confirm edit + delete on Expo Go.
- [ ] **Step 5:** Commit: `feat: edit + delete restaurant`.

---

## Slice-1 Done When

- App boots in Expo Go on the phone; tabs My List · Bookmarks · Add work.
- A restaurant can be added manually and appears in the list immediately (spec §13.1 minus Google search).
- Personal rating + visit note save and persist after reload (spec §13.4).
- A wine (spec §13.5) and a dish can be added to any restaurant.
- Bookmarking + filter-by-bookmarks works (spec §13.6).
- Sample seed loads on first launch and does not duplicate on second (spec §13.8 scaffolding; full 28 is content-dependent).
- `npm test` and `npm run typecheck` are green.

## Explicitly Deferred to Slice 2

Nearby map (react-native-maps dev build), Google Places (autocomplete + details + photos + hours), Reddit search, detail **Reviews** tab live sources, EAS Ad Hoc iOS build, EAS Update. Spec §13.2/§13.3/§13.7 and §11 land there.
