import { and, eq, sql } from 'drizzle-orm';
import { restaurants, dishes, ratings } from './schema';
import type { MesaDb } from './types';
import type { RatingSource } from '@/domain';
import { lisbonSeed, type SeedRestaurant } from './seeds/lisbon-restaurants';
import { newId } from '@/utils/id';

// Bump whenever the seed content changes (new restaurants, or updated
// ratings/editorial). An already-populated DB whose stored seed_version is
// behind this value gets a one-time, non-destructive re-sync via syncSeedData.
export const SEED_VERSION = 1;

function seedZone(r: SeedRestaurant): string | undefined {
  return r.zone ?? r.city ?? undefined;
}

// Natural key for matching a seed entry to an existing row. Seed rows carry no
// stable id (they get a fresh newId on insert), so matches are by name+zone,
// case-insensitive. Editing a seeded restaurant's name or zone will break the
// match and cause the next sync to re-insert it as a new row — acceptable for
// this dataset (never destructive, just a possible duplicate).
function naturalKey(name: string, zone: string | null | undefined): string {
  return `${name.trim().toLowerCase()}|${(zone ?? '').trim().toLowerCase()}`;
}

// Insert one seed restaurant plus its ratings and dish note. Shared by the
// fresh-seed path and the re-sync insert path so both stay identical.
function insertSeedRestaurant(db: MesaDb, r: SeedRestaurant, now: string): string {
  const id = newId();
  db.insert(restaurants)
    .values({
      id,
      name: r.name,
      category: r.category,
      zone: seedZone(r),
      price_range: r.price_range,
      latitude: r.latitude,
      longitude: r.longitude,
      created_at: now,
      editorial_json: r.editorial ? JSON.stringify(r.editorial) : undefined,
    })
    .run();

  for (const rt of r.ratings ?? []) {
    db.insert(ratings)
      .values({
        id: newId(),
        restaurant_id: id,
        // 'opentable' is a valid stored source the consensus understands,
        // though it's outside the app's editable RatingSource union.
        source: rt.source as RatingSource,
        score: rt.score,
        max_score: rt.max_score,
        review_count: rt.review_count,
        fetched_at: now,
      })
      .run();
  }

  if (r.dish_notes) {
    db.insert(dishes)
      .values({ id: newId(), restaurant_id: id, name: r.dish_notes, must_try: 1, source: 'personal' })
      .run();
  }

  return id;
}

// Seeds the curated eat-list on first launch only. Idempotent: if the
// restaurants table already has rows it inserts nothing and returns 0
// (spec §10). Returns the number of restaurants inserted.
export async function seedIfEmpty(db: MesaDb): Promise<number> {
  const existing = db.select().from(restaurants).all();
  if (existing.length > 0) return 0;

  const now = new Date().toISOString();
  for (const r of lisbonSeed) insertSeedRestaurant(db, r, now);
  return lisbonSeed.length;
}

function getSeedVersion(db: MesaDb): number {
  const row = db.get<{ value: string } | undefined>(
    sql`SELECT value FROM app_meta WHERE key = 'seed_version'`,
  );
  return row ? Number(row.value) || 0 : 0;
}

function setSeedVersion(db: MesaDb, v: number): void {
  db.run(sql`INSERT OR REPLACE INTO app_meta (key, value) VALUES ('seed_version', ${String(v)})`);
}

export interface SyncResult {
  seeded: number; // restaurants inserted on a fresh DB
  inserted: number; // new seed restaurants added to an already-populated DB
  refreshed: number; // existing restaurants whose seed ratings/editorial were re-synced
}

// Non-destructive seed sync, run at startup in place of seedIfEmpty.
//
// - Empty DB            → full seed, stamp seed_version.
// - Populated, up to date → no-op.
// - Populated, behind    → for each seed entry: insert it if missing; otherwise
//   refresh ONLY the rating sources the seed provides and its editorial. User-
//   owned data is never touched: bookmarked, visited, personal rating, visits,
//   personal notes, user-added restaurants, and any rating source the seed does
//   not provide (e.g. a manually entered Google score for a spot the seed left
//   unscored) all survive. Matched by name+zone.
export async function syncSeedData(db: MesaDb): Promise<SyncResult> {
  const now = new Date().toISOString();
  const existing = db.select().from(restaurants).all();

  if (existing.length === 0) {
    for (const r of lisbonSeed) insertSeedRestaurant(db, r, now);
    setSeedVersion(db, SEED_VERSION);
    return { seeded: lisbonSeed.length, inserted: 0, refreshed: 0 };
  }

  if (getSeedVersion(db) >= SEED_VERSION) {
    return { seeded: 0, inserted: 0, refreshed: 0 };
  }

  const byKey = new Map(existing.map((r) => [naturalKey(r.name, r.zone), r]));
  let inserted = 0;
  let refreshed = 0;

  for (const r of lisbonSeed) {
    const match = byKey.get(naturalKey(r.name, seedZone(r) ?? null));
    if (!match) {
      insertSeedRestaurant(db, r, now);
      inserted++;
      continue;
    }

    // Refresh only the sources the seed provides — delete+reinsert each one so
    // a source the user doesn't have gets added and an existing one is updated,
    // while personal and any unrelated user-added sources are left alone.
    for (const rt of r.ratings ?? []) {
      db.delete(ratings)
        .where(and(eq(ratings.restaurant_id, match.id), eq(ratings.source, rt.source as RatingSource)))
        .run();
      db.insert(ratings)
        .values({
          id: newId(),
          restaurant_id: match.id,
          source: rt.source as RatingSource,
          score: rt.score,
          max_score: rt.max_score,
          review_count: rt.review_count,
          fetched_at: now,
        })
        .run();
    }

    // Editorial is seed-owned; only write it when the seed actually has it, so
    // a seed entry that lost editorial doesn't wipe existing signals.
    if (r.editorial) {
      db.update(restaurants)
        .set({ editorial_json: JSON.stringify(r.editorial) })
        .where(eq(restaurants.id, match.id))
        .run();
    }

    if ((r.ratings?.length ?? 0) > 0 || r.editorial) refreshed++;
  }

  setSeedVersion(db, SEED_VERSION);
  return { seeded: 0, inserted, refreshed };
}
