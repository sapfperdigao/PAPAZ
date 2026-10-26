import { and, eq, sql } from 'drizzle-orm';
import type { Category, PriceRange, RatingSource, WineType } from '@/domain';
import { haversineKm, type LatLng } from '@/utils/haversine';
import { normalizeScore } from '@/utils/normalizeRating';
import { newId } from '@/utils/id';
import { consensusScore, type EditorialSignals, type SourceInput } from '@/scoring/consensus';
import type { MesaDb } from './types';
import {
  restaurants,
  ratings,
  dishes,
  wines,
  visits,
  type Restaurant,
  type Rating,
  type Dish,
  type Wine,
  type Visit,
} from './schema';

// Original max per source — used to record max_score alongside the
// normalized score (spec §6).
const SOURCE_MAX: Record<RatingSource, number> = {
  google: 5,
  thefork: 10,
  tripadvisor: 5,
  personal: 5,
  reddit: 10,
};

export type SortKey = 'distance' | 'rating' | 'name' | 'zone' | 'consensus';
export type VisitedFilter = 'visited' | 'unvisited' | 'all';

export interface ListOpts {
  sort: SortKey;
  categories?: Category[];
  prices?: PriceRange[];
  visited?: VisitedFilter;
  bookmarkedOnly?: boolean;
  search?: string;
  origin?: LatLng;
}

export interface RestaurantListItem extends Restaurant {
  // Personal rating in STARS (0.5–5.0), null if unrated.
  personalRating: number | null;
  // Blended multi-source consensus score (0–10), null if no ratings.
  consensus: number | null;
  // Consensus uncertainty band (±), null if no ratings.
  consensusBand: number | null;
  // Straight-line km from origin, null if no origin or no coords.
  distanceKm: number | null;
}

export interface CreateRestaurantInput {
  name: string;
  category: Category;
  address?: string;
  zone?: string;
  price_range?: PriceRange;
  latitude?: number;
  longitude?: number;
  website?: string;
  phone?: string;
  google_place_id?: string;
  thefork_url?: string;
  tripadvisor_url?: string;
}

function personalStars(score: number | null): number | null {
  // Personal ratings are stored normalized (stars × 2); display as stars.
  return score == null ? null : score / 2;
}

function parseEditorial(json: string | null): EditorialSignals | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as EditorialSignals;
  } catch {
    return undefined;
  }
}

// Build the consensus from a restaurant's own ratings rows + editorial. Each
// stored ratings.score is already on a 0–10 axis, which is exactly the
// consensus input. Returns null when there are no numeric ratings.
function consensusFor(rows: Rating[], editorialJson: string | null) {
  const sources: SourceInput[] = rows
    .filter((rt) => rt.score != null)
    .map((rt) => ({ source: rt.source, score: rt.score as number, reviewCount: rt.review_count ?? 0 }));
  return consensusScore(sources, parseEditorial(editorialJson));
}

// FTS5 full-text search over name/zone/address. Tokenizes the query on
// non-alphanumeric characters (so punctuation can't produce an invalid MATCH
// expression — Review Focus #3) and prefix-matches each token. The unicode61
// tokenizer strips diacritics, so an ascii query ("ze") matches an accented
// name ("Zé") and vice-versa. Returns null when the query has no usable
// tokens, meaning "no search constraint".
function searchIds(db: MesaDb, q: string): Set<string> | null {
  const tokens = q.toLowerCase().split(/[^0-9a-zà-ÿ]+/i).filter(Boolean);
  if (tokens.length === 0) return null;
  const matchExpr = tokens.map((t) => `${t}*`).join(' ');
  try {
    const rows = db.all(
      sql`SELECT r.id as id FROM restaurants r JOIN restaurants_fts f ON r.rowid = f.rowid WHERE restaurants_fts MATCH ${matchExpr}`,
    ) as { id: string }[];
    return new Set(rows.map((row) => row.id));
  } catch {
    // FTS5 not available (web build) — search returns no constraint
    return null;
  }
}

export function listRestaurants(db: MesaDb, opts: ListOpts): RestaurantListItem[] {
  const base = db.select().from(restaurants).all() as Restaurant[];

  // One pass over all ratings, grouped by restaurant — feeds both the personal
  // star display and the consensus blend.
  const allRatings = db.select().from(ratings).all() as Rating[];
  const byRestaurant = new Map<string, Rating[]>();
  for (const rt of allRatings) {
    const list = byRestaurant.get(rt.restaurant_id);
    if (list) list.push(rt);
    else byRestaurant.set(rt.restaurant_id, [rt]);
  }

  let items: RestaurantListItem[] = base.map((r) => {
    const rows = byRestaurant.get(r.id) ?? [];
    const personal = rows.find((rt) => rt.source === 'personal');
    const c = consensusFor(rows, r.editorial_json);
    return {
      ...r,
      personalRating: personalStars(personal?.score ?? null),
      consensus: c?.score ?? null,
      consensusBand: c?.band ?? null,
      distanceKm:
        opts.origin && r.latitude != null && r.longitude != null
          ? haversineKm(opts.origin, { lat: r.latitude, lng: r.longitude })
          : null,
    };
  });

  if (opts.categories?.length) {
    items = items.filter((r) => opts.categories!.includes(r.category));
  }
  if (opts.prices?.length) {
    items = items.filter((r) => r.price_range != null && opts.prices!.includes(r.price_range));
  }
  if (opts.visited && opts.visited !== 'all') {
    const want = opts.visited === 'visited' ? 1 : 0;
    items = items.filter((r) => r.visited === want);
  }
  if (opts.bookmarkedOnly) {
    items = items.filter((r) => r.bookmarked === 1);
  }
  if (opts.search) {
    const ids = searchIds(db, opts.search);
    if (ids) items = items.filter((r) => ids.has(r.id));
  }

  const byName = (a: RestaurantListItem, b: RestaurantListItem) =>
    a.name.localeCompare(b.name);

  switch (opts.sort) {
    case 'name':
      items.sort(byName);
      break;
    case 'zone':
      items.sort((a, b) => (a.zone ?? '').localeCompare(b.zone ?? '') || byName(a, b));
      break;
    case 'rating':
      items.sort((a, b) => {
        if (a.personalRating == null && b.personalRating == null) return byName(a, b);
        if (a.personalRating == null) return 1;
        if (b.personalRating == null) return -1;
        return b.personalRating - a.personalRating || byName(a, b);
      });
      break;
    case 'distance':
      items.sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return byName(a, b);
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
      break;
    case 'consensus':
      items.sort((a, b) => {
        if (a.consensus == null && b.consensus == null) return byName(a, b);
        if (a.consensus == null) return 1;
        if (b.consensus == null) return -1;
        return b.consensus - a.consensus || byName(a, b);
      });
      break;
  }

  return items;
}

export type BookmarkMode = 'all' | 'want-to-try' | 'visited-loved';

// Sub-filter for the Bookmarks tab (spec §7.3). Operates on already-listed
// items so it composes with listRestaurants({ bookmarkedOnly: true }).
export function bookmarkSubfilter(r: RestaurantListItem, mode: BookmarkMode): boolean {
  if (r.bookmarked !== 1) return false;
  switch (mode) {
    case 'all':
      return true;
    case 'want-to-try':
      return r.visited === 0;
    case 'visited-loved':
      return r.visited === 1 && (r.personalRating ?? 0) >= 4.0;
  }
}

export function getRestaurant(db: MesaDb, id: string): Restaurant | undefined {
  return db.select().from(restaurants).where(eq(restaurants.id, id)).get() as
    | Restaurant
    | undefined;
}

// Editorial signals (Michelin/Repsol/Time Out/…) stored as JSON on the
// restaurant row; feeds the consensus editorial bonus.
export function getEditorial(db: MesaDb, id: string): EditorialSignals | undefined {
  return parseEditorial(getRestaurant(db, id)?.editorial_json ?? null);
}

export function setEditorial(db: MesaDb, id: string, signals: EditorialSignals): void {
  db.update(restaurants)
    .set({ editorial_json: JSON.stringify(signals) })
    .where(eq(restaurants.id, id))
    .run();
}

// Full consensus (score + band + counts) for one restaurant — for the detail
// screen. Returns null when the restaurant has no numeric ratings.
export function getConsensus(db: MesaDb, id: string) {
  const r = getRestaurant(db, id);
  if (!r) return null;
  const rows = db.select().from(ratings).where(eq(ratings.restaurant_id, id)).all() as Rating[];
  return consensusFor(rows, r.editorial_json);
}

export function createRestaurant(db: MesaDb, input: CreateRestaurantInput): string {
  const id = newId();
  db.insert(restaurants)
    .values({ ...input, id, created_at: new Date().toISOString() })
    .run();
  return id;
}

export function updateRestaurant(
  db: MesaDb,
  id: string,
  patch: Partial<CreateRestaurantInput>,
): void {
  // The edit form submits every field; a cleared optional arrives as
  // undefined. Drizzle's .set() drops undefined keys (leaving the old value),
  // so coerce undefined → null to actually clear the column.
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    normalized[key] = value === undefined ? null : value;
  }
  db.update(restaurants).set(normalized).where(eq(restaurants.id, id)).run();
}

export function deleteRestaurant(db: MesaDb, id: string): void {
  db.delete(restaurants).where(eq(restaurants.id, id)).run();
}

export function setBookmark(db: MesaDb, id: string, on: boolean): void {
  db.update(restaurants).set({ bookmarked: on ? 1 : 0 }).where(eq(restaurants.id, id)).run();
}

export function setVisited(db: MesaDb, id: string, on: boolean): void {
  db.update(restaurants).set({ visited: on ? 1 : 0 }).where(eq(restaurants.id, id)).run();
}

// Ratings --------------------------------------------------------------

export function getRatings(db: MesaDb, restaurantId: string): Rating[] {
  return db.select().from(ratings).where(eq(ratings.restaurant_id, restaurantId)).all() as Rating[];
}

// Upsert a single source's score. rawScore is in the source's native scale
// (e.g. TripAdvisor 0–5); it is stored normalized to 0–10 (spec §6).
export function upsertManualScore(
  db: MesaDb,
  restaurantId: string,
  source: RatingSource,
  rawScore: number,
  reviewCount?: number,
  url?: string,
): void {
  db.delete(ratings)
    .where(and(eq(ratings.restaurant_id, restaurantId), eq(ratings.source, source)))
    .run();
  db.insert(ratings)
    .values({
      id: newId(),
      restaurant_id: restaurantId,
      source,
      score: normalizeScore(source, rawScore),
      max_score: SOURCE_MAX[source],
      review_count: reviewCount,
      url,
      fetched_at: new Date().toISOString(),
    })
    .run();
}

// Personal rating given in stars (0.5–5.0); stored as a normalized personal
// ratings row.
export function setPersonalRating(db: MesaDb, restaurantId: string, stars: number): void {
  upsertManualScore(db, restaurantId, 'personal', stars);
}

// Dishes ---------------------------------------------------------------

export interface DishInput {
  name: string;
  description?: string;
  source?: string;
  must_try?: boolean;
}

export function getDishes(db: MesaDb, restaurantId: string): Dish[] {
  return db.select().from(dishes).where(eq(dishes.restaurant_id, restaurantId)).all() as Dish[];
}

export function addDish(db: MesaDb, restaurantId: string, input: DishInput): string {
  const id = newId();
  db.insert(dishes)
    .values({
      id,
      restaurant_id: restaurantId,
      name: input.name,
      description: input.description,
      source: input.source,
      must_try: input.must_try === false ? 0 : 1,
    })
    .run();
  return id;
}

export function deleteDish(db: MesaDb, id: string): void {
  db.delete(dishes).where(eq(dishes.id, id)).run();
}

// Wines ----------------------------------------------------------------

export interface WineInput {
  name: string;
  wine_type?: WineType;
  region?: string;
  producer?: string;
  notes?: string;
  is_personal?: boolean;
}

export function getWines(db: MesaDb, restaurantId: string): Wine[] {
  return db.select().from(wines).where(eq(wines.restaurant_id, restaurantId)).all() as Wine[];
}

// Groups wines by type for the grouped Wine tab (spec §7.4). Wines with no
// type fall under 'other'.
export function groupWinesByType(list: Wine[]): Record<string, Wine[]> {
  const out: Record<string, Wine[]> = {};
  for (const w of list) {
    const key = w.wine_type ?? 'other';
    (out[key] ??= []).push(w);
  }
  return out;
}

export function addWine(db: MesaDb, restaurantId: string, input: WineInput): string {
  const id = newId();
  db.insert(wines)
    .values({
      id,
      restaurant_id: restaurantId,
      name: input.name,
      wine_type: input.wine_type,
      region: input.region,
      producer: input.producer,
      notes: input.notes,
      is_personal: input.is_personal === false ? 0 : 1,
    })
    .run();
  return id;
}

export function deleteWine(db: MesaDb, id: string): void {
  db.delete(wines).where(eq(wines.id, id)).run();
}

// Visits ---------------------------------------------------------------

export interface VisitInput {
  visited_at: string;
  personal_rating?: number;
  personal_notes?: string;
}

export function getVisits(db: MesaDb, restaurantId: string): Visit[] {
  return db.select().from(visits).where(eq(visits.restaurant_id, restaurantId)).all() as Visit[];
}

export function addVisit(db: MesaDb, restaurantId: string, input: VisitInput): string {
  const id = newId();
  db.insert(visits)
    .values({
      id,
      restaurant_id: restaurantId,
      visited_at: input.visited_at,
      personal_rating: input.personal_rating,
      personal_notes: input.personal_notes,
    })
    .run();
  return id;
}

export function deleteVisit(db: MesaDb, id: string): void {
  db.delete(visits).where(eq(visits.id, id)).run();
}
