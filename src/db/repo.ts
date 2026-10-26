import { and, eq, sql } from 'drizzle-orm';
import type { Category, PriceRange, RatingSource, WineType } from '@/domain';
import { haversineKm, type LatLng } from '@/utils/haversine';
import { normalizeScore } from '@/utils/normalizeRating';
import { newId } from '@/utils/id';
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

export type SortKey = 'distance' | 'rating' | 'name' | 'zone';
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
  const rows = db.all(
    sql`SELECT r.id as id FROM restaurants r JOIN restaurants_fts f ON r.rowid = f.rowid WHERE restaurants_fts MATCH ${matchExpr}`,
  ) as { id: string }[];
  return new Set(rows.map((row) => row.id));
}

export function listRestaurants(db: MesaDb, opts: ListOpts): RestaurantListItem[] {
  const base = db.select().from(restaurants).all() as Restaurant[];

  const personalRows = db
    .select()
    .from(ratings)
    .where(eq(ratings.source, 'personal'))
    .all() as Rating[];
  const personalMap = new Map(personalRows.map((r) => [r.restaurant_id, r.score ?? null]));

  let items: RestaurantListItem[] = base.map((r) => ({
    ...r,
    personalRating: personalStars(personalMap.get(r.id) ?? null),
    distanceKm:
      opts.origin && r.latitude != null && r.longitude != null
        ? haversineKm(opts.origin, { lat: r.latitude, lng: r.longitude })
        : null,
  }));

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

export function getRestaurant(db: MesaDb, id: string): Restaurant | undefined {  return db.select().from(restaurants).where(eq(restaurants.id, id)).get() as
    | Restaurant
    | undefined;
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
  db.update(restaurants).set(patch).where(eq(restaurants.id, id)).run();
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
