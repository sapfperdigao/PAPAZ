import { restaurants, dishes, ratings } from './schema';
import type { MesaDb } from './types';
import type { RatingSource } from '@/domain';
import { lisbonSeed } from './seeds/lisbon-restaurants';
import { newId } from '@/utils/id';

// Seeds the curated eat-list on first launch only. Idempotent: if the
// restaurants table already has rows it inserts nothing and returns 0
// (spec §10). Returns the number of restaurants inserted.
export async function seedIfEmpty(db: MesaDb): Promise<number> {
  const existing = db.select().from(restaurants).all();
  if (existing.length > 0) return 0;

  const now = new Date().toISOString();

  for (const r of lisbonSeed) {
    const id = newId();
    db.insert(restaurants)
      .values({
        id,
        name: r.name,
        category: r.category,
        zone: r.zone ?? r.city ?? undefined,
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
  }

  return lisbonSeed.length;
}
