// Canonical domain enums — single source of truth shared by the schema,
// repository, and UI. Task 3's schema.ts re-exports these rather than
// redefining them.

export type Category = 'tasca' | 'cervejaria' | 'marisqueira' | 'other';
export type PriceRange = '€' | '€€' | '€€€' | '€€€€';
export type RatingSource =
  | 'google'
  | 'thefork'
  | 'tripadvisor'
  | 'reddit'
  | 'personal';
export type WineType =
  | 'red'
  | 'white'
  | 'green'
  | 'rosé'
  | 'sparkling'
  | 'natural'
  | 'fortified';
