import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import type { Category, PriceRange, RatingSource, WineType } from '@/domain';

// Re-export the canonical domain enums (single source of truth in src/domain.ts).
export type { Category, PriceRange, RatingSource, WineType } from '@/domain';

// Column definitions mirror the DDL in ./ddl.ts (spec §6) exactly. The schema
// test inserts/reads through these against the DDL-created tables, so any
// drift between the two fails the suite.

export const restaurants = sqliteTable('restaurants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  zone: text('zone'),
  category: text('category').$type<Category>().notNull(),
  price_range: text('price_range').$type<PriceRange>(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  website: text('website'),
  phone: text('phone'),
  google_place_id: text('google_place_id'),
  thefork_url: text('thefork_url'),
  tripadvisor_url: text('tripadvisor_url'),
  bookmarked: integer('bookmarked').notNull().default(0),
  visited: integer('visited').notNull().default(0),
  created_at: text('created_at').notNull(),
});

export const ratings = sqliteTable('ratings', {
  id: text('id').primaryKey(),
  restaurant_id: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  source: text('source').$type<RatingSource>().notNull(),
  score: real('score'),
  max_score: real('max_score'),
  review_count: integer('review_count'),
  review_text: text('review_text'),
  url: text('url'),
  fetched_at: text('fetched_at').notNull(),
});

export const dishes = sqliteTable('dishes', {
  id: text('id').primaryKey(),
  restaurant_id: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  must_try: integer('must_try').notNull().default(1),
  source: text('source'),
});

export const wines = sqliteTable('wines', {
  id: text('id').primaryKey(),
  restaurant_id: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  wine_type: text('wine_type').$type<WineType>(),
  region: text('region'),
  producer: text('producer'),
  notes: text('notes'),
  is_personal: integer('is_personal').notNull().default(1),
});

export const visits = sqliteTable('visits', {
  id: text('id').primaryKey(),
  restaurant_id: text('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  visited_at: text('visited_at').notNull(),
  personal_rating: real('personal_rating'),
  personal_notes: text('personal_notes'),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type Rating = typeof ratings.$inferSelect;
export type Dish = typeof dishes.$inferSelect;
export type Wine = typeof wines.$inferSelect;
export type Visit = typeof visits.$inferSelect;
