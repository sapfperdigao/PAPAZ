// Canonical schema DDL — spec §6 verbatim (tables, indexes, FTS5), plus the
// external-content sync triggers FTS5 requires to stay in step with the
// restaurants table (the spec names the FTS table but not its triggers).
// Run once on DB open against both expo-sqlite (app) and better-sqlite3 (tests).

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

CREATE VIRTUAL TABLE IF NOT EXISTS restaurants_fts USING fts5(
  name, zone, address,
  content='restaurants', content_rowid='rowid'
);

CREATE TRIGGER IF NOT EXISTS restaurants_ai AFTER INSERT ON restaurants BEGIN
  INSERT INTO restaurants_fts(rowid, name, zone, address)
  VALUES (new.rowid, new.name, new.zone, new.address);
END;

CREATE TRIGGER IF NOT EXISTS restaurants_ad AFTER DELETE ON restaurants BEGIN
  INSERT INTO restaurants_fts(restaurants_fts, rowid, name, zone, address)
  VALUES ('delete', old.rowid, old.name, old.zone, old.address);
END;

CREATE TRIGGER IF NOT EXISTS restaurants_au AFTER UPDATE ON restaurants BEGIN
  INSERT INTO restaurants_fts(restaurants_fts, rowid, name, zone, address)
  VALUES ('delete', old.rowid, old.name, old.zone, old.address);
  INSERT INTO restaurants_fts(rowid, name, zone, address)
  VALUES (new.rowid, new.name, new.zone, new.address);
END;
`;
