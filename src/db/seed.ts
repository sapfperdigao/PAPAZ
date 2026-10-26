import { restaurants, dishes, ratings, wines } from './schema';
import type { MesaDb } from './types';
import { lisbonSeed } from './seeds/lisbon-restaurants';
import { newId } from '@/utils/id';

// Seeds the built-in Lisbon sample on first launch only. Idempotent: if the
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
        address: r.address,
        zone: r.zone,
        category: r.category,
        price_range: r.price_range,
        latitude: r.latitude,
        longitude: r.longitude,
        website: r.website,
        phone: r.phone,
        thefork_url: r.thefork_url,
        tripadvisor_url: r.tripadvisor_url,
        created_at: now,
      })
      .run();

    for (const d of r.dishes ?? []) {
      db.insert(dishes)
        .values({
          id: newId(),
          restaurant_id: id,
          name: d.name,
          description: d.description,
          must_try: d.must_try === false ? 0 : 1,
          source: d.source,
        })
        .run();
    }

    for (const rt of r.ratings ?? []) {
      db.insert(ratings)
        .values({
          id: newId(),
          restaurant_id: id,
          source: rt.source,
          score: rt.score,
          max_score: rt.max_score,
          review_count: rt.review_count,
          url: rt.url,
          fetched_at: now,
        })
        .run();
    }

    for (const w of r.wines ?? []) {
      db.insert(wines)
        .values({
          id: newId(),
          restaurant_id: id,
          name: w.name,
          wine_type: w.wine_type,
          region: w.region,
          producer: w.producer,
          notes: w.notes,
          is_personal: 1,
        })
        .run();
    }
  }

  return lisbonSeed.length;
}
