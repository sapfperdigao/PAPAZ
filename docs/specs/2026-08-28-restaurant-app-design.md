# Mesa — Restaurant Tracker: Design Spec

**Date:** 2026-08-28
**Status:** Draft
**Scope:** Personal mobile app (iOS primary, Android secondary)

---

## 1. Purpose

A personal mobile app to manage a curated list of Lisbon restaurants (tascas and cervejarias). The app must:

- Store and browse a personal restaurant registry
- Show which registered restaurants are closest to the user's current location
- Surface aggregated review data from Google, Reddit, TheFork, and TripAdvisor
- Record personal ratings, visit notes, must-try dishes, and wine recommendations
- Bookmark restaurants for future visits

No multi-user features. No social sharing. No backend required for core functionality. Personal data stays on device.

---

## 2. Non-Goals

- User authentication / accounts
- Social features (sharing, following)
- Reservation booking
- Menu browsing / pricing scrapers
- Restaurant discovery (this is a manual registry, not a search engine)
- App Store distribution

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React Native + Expo SDK 52 (TypeScript) | Cross-platform, runs on phone via Expo Go during dev, EAS Build for standalone install |
| Navigation | Expo Router (file-based) | Cleaner than React Navigation for this scale, built-in deep linking |
| Local DB | expo-sqlite (SQLite via Drizzle ORM) | Offline-first, typed queries, zero backend |
| State | Zustand (UI state) + TanStack Query (async/API state) | Minimal boilerplate |
| Maps | react-native-maps + expo-location | Native map tiles, GPS access |
| Styling | NativeWind (Tailwind for RN) | Consistent design tokens, no stylesheet boilerplate |
| Icons | @expo/vector-icons (Ionicons set) | Bundled with Expo, no extra install |
| External APIs | Google Places API (New), Reddit API | See Section 7 |
| Build | Expo EAS Build (Ad Hoc profile) | Installs on device without App Store |
| OTA updates | EAS Update | JS-layer updates without rebuild |

---

## 4. App Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Mesa Mobile App                     │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Nearby  │  │ My List  │  │Bookmarks │           │
│  │  (Map)   │  │          │  │          │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │              │              │                 │
│       └──────────────┴──────────────┘                 │
│                      │                                │
│             ┌─────────▼──────────┐                   │
│             │  Restaurant Detail  │                   │
│             │  (tabs: overview,   │                   │
│             │   reviews, dishes,  │                   │
│             │   wine, my notes)   │                   │
│             └─────────┬──────────┘                   │
│                       │                               │
│        ┌──────────────┼──────────────┐               │
│        ▼              ▼              ▼               │
│   SQLite DB     Google Places    Reddit API          │
│   (on device)   API              API                 │
└─────────────────────────────────────────────────────┘
```

**Data flow:**
- All personal data (ratings, notes, wine, bookmarks, restaurant entries) writes to SQLite.
- On restaurant detail open: check SQLite cache age for Google/Reddit data. If stale (>24h), fetch fresh and update cache.
- TheFork and TripAdvisor scores are manually entered by the user — stored as static ratings records.
- Location is read on-demand (not continuously) to calculate distances.

---

## 5. Navigation Structure

```
(tabs)
  ├── /nearby            — Map + proximity list
  ├── /list              — All restaurants (list view)
  │     └── /list/[id]   — Restaurant detail (shared route)
  ├── /bookmarks         — Bookmarked restaurants
  └── /add               — Add restaurant (modal, full-screen)

(shared)
  └── /restaurant/[id]   — Restaurant detail
        ├── overview
        ├── reviews
        ├── dishes
        ├── wine
        └── my-notes
```

Bottom tab bar: **Nearby · My List · Bookmarks · Add (+)**

The `Add` tab opens a modal. The restaurant detail route is shared — reachable from all three list tabs.

---

## 6. Data Model (SQLite Schema)

```sql
-- Core restaurant record
CREATE TABLE restaurants (
  id              TEXT PRIMARY KEY,  -- UUID v4
  name            TEXT NOT NULL,
  address         TEXT,
  zone            TEXT,              -- e.g. "Campo de Ourique"
  category        TEXT NOT NULL,     -- 'tasca' | 'cervejaria' | 'marisqueira' | 'other'
  price_range     TEXT,              -- '€' | '€€' | '€€€' | '€€€€'
  latitude        REAL,
  longitude       REAL,
  website         TEXT,
  phone           TEXT,
  google_place_id TEXT,              -- used to fetch Google data
  thefork_url     TEXT,              -- stored for reference, score entered manually
  tripadvisor_url TEXT,
  bookmarked      INTEGER NOT NULL DEFAULT 0,
  visited         INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL
);

-- Ratings from all sources
CREATE TABLE ratings (
  id            TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  source        TEXT NOT NULL,  -- 'google' | 'thefork' | 'tripadvisor' | 'reddit' | 'personal'
  score         REAL,           -- normalized to 0.0–10.0 across sources
  max_score     REAL,           -- original max (Google: 5, TheFork: 10, TA: 5)
  review_count  INTEGER,
  review_text   TEXT,           -- for reddit snippets or personal notes
  url           TEXT,
  fetched_at    TEXT NOT NULL
);

-- Must-try dishes
CREATE TABLE dishes (
  id            TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  must_try      INTEGER NOT NULL DEFAULT 1,
  source        TEXT  -- 'personal' | 'google_review' | 'reddit' | 'thefork' | 'michelin'
);

-- Wine recommendations
CREATE TABLE wines (
  id            TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  wine_type     TEXT,   -- 'red' | 'white' | 'green' | 'rosé' | 'sparkling' | 'natural' | 'fortified'
  region        TEXT,
  producer      TEXT,
  notes         TEXT,
  is_personal   INTEGER NOT NULL DEFAULT 1  -- 1 = your own rec, 0 = sourced
);

-- Visit log
CREATE TABLE visits (
  id              TEXT PRIMARY KEY,
  restaurant_id   TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  visited_at      TEXT NOT NULL,
  personal_rating REAL,   -- 0.5 to 5.0 in 0.5 steps
  personal_notes  TEXT
);

-- Indexes
CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_bookmarked ON restaurants(bookmarked);
CREATE INDEX idx_ratings_restaurant_source ON ratings(restaurant_id, source);
CREATE INDEX idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX idx_wines_restaurant ON wines(restaurant_id);
CREATE INDEX idx_visits_restaurant ON visits(restaurant_id);

-- FTS for search
CREATE VIRTUAL TABLE restaurants_fts USING fts5(
  name, zone, address,
  content='restaurants', content_rowid='rowid'
);
```

**Score normalization:** All external ratings stored normalized to 0–10 for the consensus display.
- Google: `score * 2` (4.7★ → 9.4)
- TheFork: already 0–10
- TripAdvisor: `score * 2` (4.0★ → 8.0)
- Personal: `score * 2` (4.0★ personal → 8.0 normalized)

---

## 7. Feature Specifications

### 7.1 Nearby Screen

- Requests `foregroundPermissions` on first open with explanation dialog.
- If denied: shows list sorted alphabetically, distance column hidden, map tab disabled.
- If granted: shows full-screen map (react-native-maps — Apple Maps on iOS, no additional billing).
- Restaurant pins colored by category: tasca = amber, cervejaria = blue, bookmarked = red heart.
- Tap pin → bottom sheet with name, distance, personal rating (if visited), "Open" button.
- Toggle button: Map ↔ List. List view sorted by distance ascending, shows km.
- Distance calculated with Haversine — no API call. Straight-line distance.
- "Within X km" filter chips: 0.5 / 1 / 2 / 5 / all.

### 7.2 My List Screen

- FlatList of all restaurants. Default sort: personal rating desc, unrated at bottom alphabetically.
- Restaurant card: name, zone, category badge, price badge, personal rating (stars, greyed if not visited), bookmarked icon, visited checkmark.
- Sort bar: Distance · Rating · Name · Zone.
- Filter drawer: Category (multi-select), Price (multi-select), Visited / Unvisited / All, Bookmarked only.
- Search bar: FTS5 search across name, zone, address.

### 7.3 Bookmarks Screen

- Identical to My List but pre-filtered to `bookmarked = 1`.
- Sub-filter chips at top: All / Want to Try / Visited & Loved.
- "Want to Try" = bookmarked + not visited. "Visited & Loved" = bookmarked + visited + personal_rating >= 4.0.

### 7.4 Restaurant Detail Screen

Five tabs:

**Overview**
- Restaurant name, zone, category badge, price badge.
- Address with "Open in Maps" button (deep links to Apple Maps / Google Maps).
- Website link (in-app browser via expo-web-browser).
- Opening hours from Google Places (cached).
- Up to 3 photos from Google Places (cached) in a horizontal scroll.
- Consensus rating bar: visual breakdown of Google / TheFork / TripAdvisor / Reddit / Personal scores.

**Reviews**
- One card per source with: source logo/name, score, review count, last fetched.
- Google: top 3 review snippets (from Places API).
- Reddit: top 3 thread snippets (from Reddit search).
- TheFork / TripAdvisor: score + review count (manually entered), with link to open full page in browser.
- Refresh button (top right) — re-fetches Google + Reddit, updates cache.

**Dishes**
- List of must-try dishes with source badge.
- Add dish button (bottom right FAB) → modal with name, description, source, must-try toggle.
- Swipe left to delete.

**Wine**
- List of wine recommendations grouped by type.
- Add wine button → modal with name, type (picker), region, producer, notes, personal/sourced toggle.
- Swipe left to delete.

**My Notes**
- Personal rating: 5-star picker (0.5 increments), tap to rate.
- Visit log: list of past visits (date + rating + notes). Add visit button → date picker + notes field.
- "Mark as visited" toggle (syncs `restaurants.visited`).
- "Bookmark" toggle (syncs `restaurants.bookmarked`).

### 7.5 Add Restaurant Screen (Modal)

Step 1 — Search:
- Text input → calls Google Places Autocomplete API → shows list of matches.
- Tap match → auto-fills: name, address, lat/lng, google_place_id, website, phone.
- "Add manually" fallback if no search result — skips auto-fill, all fields manual.

Step 2 — Details:
- Category picker (required).
- Price range picker (required).
- Zone field (pre-filled from address parsing, editable).
- TheFork URL (optional).
- TripAdvisor URL (optional).

Step 3 — Confirm:
- Summary card. "Save" creates the restaurant record, triggers Google Places detail fetch in background, closes modal.

### 7.6 Edit Restaurant

Accessible via kebab menu (⋮) on detail screen header.
Same form as Add, pre-filled. Includes "Delete restaurant" option at bottom (with confirmation).

---

## 8. API Integrations

### 8.1 Google Places API (New)

**Used for:** Autocomplete (Add flow), Place Details (name, address, hours, photos, rating, reviews).

**Endpoints:**
- `POST /v1/places:searchText` — for Add search autocomplete
- `GET /v1/places/{place_id}` — for place details (rating, reviews, hours, photos)

**Fields requested (to minimize billing):**
```
displayName, formattedAddress, location, rating, userRatingCount,
currentOpeningHours, websiteUri, nationalPhoneNumber,
reviews (top 5), photos (top 3)
```

**Caching:** Results stored in SQLite (`ratings` table for score/reviews, `restaurants` table for hours/photos as JSON blobs). Cache TTL: 24 hours. Stale-while-revalidate: show cached data immediately, refresh in background.

**Cost:** Places Details = $17/1000. Personal use (<50 fetches/day) costs ~$0.85/day → covered entirely by $200/month free credit.

### 8.2 Reddit API

**Used for:** Searching mentions of restaurants in r/lisboa, r/portugal, r/food.

**Authentication:** OAuth2 client credentials (app-only, no user login).

**Endpoint:** `GET /search?q={name}+Lisboa&restrict_sr=false&sort=relevance&limit=5`
Subreddits searched: `lisboa`, `portugal`.

**Data extracted:** Post title, snippet (selftext first 200 chars), upvotes, URL, date.
Stored in `ratings` table as `source = 'reddit'`, `review_text` = JSON array of snippets.

**Rate limits:** 60 requests/minute for personal scripts — well within tolerance.

### 8.3 TheFork & TripAdvisor

No API. Manual entry of score + review count in the Add/Edit form and the Reviews tab ("Edit scores" button). The `thefork_url` and `tripadvisor_url` fields are stored to open in browser on demand.

---

## 9. Visual Design System

**Color palette (dark-mode first, light-mode supported):**
- Background: `#0F0F0F` (dark) / `#F9F9F7` (light)
- Surface: `#1C1C1E` / `#FFFFFF`
- Accent: `#E8A838` (amber — warm, restaurant/food association)
- Text primary: `#FAFAFA` / `#111111`
- Text secondary: `#9A9A9A` / `#6B6B6B`
- Tasca badge: amber `#E8A838`
- Cervejaria badge: blue `#4A90D9`
- Marisqueira badge: teal `#2BB5A0`
- Danger: `#FF453A`

**Typography:** System font (SF Pro on iOS, Roboto on Android). No custom font loading — faster startup, native feel.

**Spacing:** 4pt grid. Base unit = 4. Common: 8, 12, 16, 24, 32.

**Radius:** Cards = 12. Badges = 6. Buttons = 10. Full pill = 999.

**Maps:** Dark map style on dark mode (Mapbox dark style via react-native-maps). Light default on light mode.

---

## 10. Seed Data

On first launch, the app checks if `restaurants` table is empty. If so, it runs a seed that imports the pre-researched list of Lisbon tascas and cervejarias (21 tascas + 7 cervejarias) with their zone, category, price, must-try dishes, and manually entered TheFork/TripAdvisor scores from the research session. Coordinates pre-geocoded and stored in the seed file.

Seed file: `src/db/seeds/lisbon-restaurants.ts` — typed array of restaurant objects.

---

## 11. Build & Deployment

**Development:**
- `npx expo start` → scan QR with Expo Go on phone → live reload

**Standalone build (install without App Store):**
- iOS: `eas build --platform ios --profile preview` (Ad Hoc distribution). **Requires Apple Developer account ($99/year).** Register device UDID once via `eas device:create`.
- Android: `eas build --platform android --profile preview` → installs `.apk` directly. No developer account needed.

**OTA updates:**
- `eas update --branch preview` → JS changes deployed to phone silently on next app open
- Only rebuild needed when native dependencies change

**Environment variables:**
- `EXPO_PUBLIC_GOOGLE_PLACES_KEY` — Google Places API key
- `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` — stored in `.env.local`, never committed

---

## 12. File Structure

```
restaurant-app/
├── app/                          # Expo Router routes
│   ├── (tabs)/
│   │   ├── nearby.tsx
│   │   ├── list/
│   │   │   ├── index.tsx
│   │   │   └── [id]/
│   │   │       └── index.tsx     # Detail (redirect to /restaurant/[id])
│   │   ├── bookmarks.tsx
│   │   └── add.tsx               # Modal
│   ├── restaurant/
│   │   └── [id]/
│   │       ├── _layout.tsx       # Tab layout for detail
│   │       ├── overview.tsx
│   │       ├── reviews.tsx
│   │       ├── dishes.tsx
│   │       ├── wine.tsx
│   │       └── my-notes.tsx
│   └── _layout.tsx
├── src/
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema
│   │   ├── migrations/           # Auto-generated by Drizzle Kit
│   │   ├── seeds/
│   │   │   └── lisbon-restaurants.ts
│   │   └── index.ts              # DB init + export
│   ├── api/
│   │   ├── google-places.ts      # Places API client
│   │   └── reddit.ts             # Reddit API client
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   ├── useRestaurant.ts
│   │   └── useNearby.ts
│   ├── store/
│   │   └── ui.ts                 # Zustand: filters, sort state
│   ├── components/
│   │   ├── RestaurantCard.tsx
│   │   ├── RatingBar.tsx
│   │   ├── StarPicker.tsx
│   │   ├── CategoryBadge.tsx
│   │   └── PriceBadge.tsx
│   └── utils/
│       ├── haversine.ts
│       ├── normalizeRating.ts
│       └── formatDistance.ts
├── docs/
│   └── specs/
│       └── 2026-08-28-restaurant-app-design.md
├── .env.local                    # API keys (gitignored)
├── eas.json
├── app.json
└── package.json
```

---

## 13. Success Criteria

The design is complete when:

1. A restaurant can be added via Google Places search and appears in the list within 2 seconds.
2. The Nearby screen shows restaurants sorted by distance from current GPS location.
3. Opening a restaurant detail shows Google rating and Reddit snippets fetched live (or from cache).
4. A personal rating and visit note can be saved and persists after app restart.
5. A wine recommendation can be added to any restaurant.
6. Bookmarking a restaurant and filtering by bookmarks works correctly.
7. The app installs and runs on the user's iPhone via EAS Ad Hoc build.
8. All 28 seeded Lisbon restaurants are present on first launch with correct data.
