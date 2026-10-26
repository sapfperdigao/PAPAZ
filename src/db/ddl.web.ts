// Web-safe DDL: identical to ddl.ts except the FTS5 virtual table and its
// sync triggers are omitted — sql.js standard build lacks the fts5 extension.
// Text search degrades to no-op on web; all other features work normally.

export const DDL = `
CREATE TABLE IF NOT EXISTS restaurants (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  address         TEXT,
  zone            TEXT,
  category        TEXT NOT NULL,
  price_range     TEXT,
  latitude        REAL,
  longitude       REAL,
  website         TEXT,
  phone           TEXT,
  google_place_id TEXT,
  thefork_url     TEXT,
  tripadvisor_url TEXT,
  bookmarked      INTEGER NOT NULL DEFAULT 0,
  visited         INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
  id            TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  source        TEXT NOT NULL,
  score         REAL,
  max_score     REAL,
  review_count  INTEGER,
  review_text   TEXT,
  url           TEXT,
  fetched_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dishes (
  id            TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  must_try      INTEGER NOT NULL DEFAULT 1,
  source        TEXT
);

CREATE TABLE IF NOT EXISTS wines (
  id            TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  wine_type     TEXT,
  region        TEXT,
  producer      TEXT,
  notes         TEXT,
  is_personal   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS visits (
  id              TEXT PRIMARY KEY,
  restaurant_id   TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  visited_at      TEXT NOT NULL,
  personal_rating REAL,
  personal_notes  TEXT
);

CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);
CREATE INDEX IF NOT EXISTS idx_restaurants_bookmarked ON restaurants(bookmarked);
CREATE INDEX IF NOT EXISTS idx_ratings_restaurant_source ON ratings(restaurant_id, source);
CREATE INDEX IF NOT EXISTS idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_wines_restaurant ON wines(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_visits_restaurant ON visits(restaurant_id);
`;
