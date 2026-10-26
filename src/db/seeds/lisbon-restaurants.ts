import type { Category, PriceRange, RatingSource, WineType } from '@/domain';

export interface SeedRating {
  source: RatingSource;
  score: number;
  max_score?: number;
  review_count?: number;
  url?: string;
}

export interface SeedDish {
  name: string;
  description?: string;
  must_try?: boolean;
  source?: string;
}

export interface SeedWine {
  name: string;
  wine_type?: WineType;
  region?: string;
  producer?: string;
  notes?: string;
}

export interface SeedRestaurant {
  name: string;
  address?: string;
  zone?: string;
  category: Category;
  price_range?: PriceRange;
  latitude?: number;
  longitude?: number;
  website?: string;
  phone?: string;
  thefork_url?: string;
  tripadvisor_url?: string;
  dishes?: SeedDish[];
  ratings?: SeedRating[];
  wines?: SeedWine[];
}

// SAMPLE seed — a handful of well-known Lisbon places so the app has content
// on first launch. Coordinates and manually-entered scores are APPROXIMATE
// and flagged for verification. The full curated 28-restaurant dataset
// (spec §10) is user-supplied content; extend this array in the same shape —
// seedIfEmpty picks up everything here.
export const lisbonSeed: SeedRestaurant[] = [
  {
    // SAMPLE — verify coords/scores
    name: 'Cervejaria Ramiro',
    address: 'Av. Almirante Reis 1, Lisboa',
    zone: 'Intendente',
    category: 'cervejaria',
    price_range: '€€€',
    latitude: 38.7223,
    longitude: -9.1355,
    thefork_url: 'https://www.thefork.pt/restaurante/cervejaria-ramiro',
    ratings: [
      { source: 'tripadvisor', score: 8.0, max_score: 10, review_count: 12000 },
    ],
    dishes: [
      { name: 'Gambas à la Guilho', must_try: true, source: 'personal' },
      { name: 'Prego no pão', description: 'The classic finisher', source: 'personal' },
    ],
  },
  {
    // SAMPLE — verify coords/scores
    name: 'O Zé dos Cornos',
    address: 'Beco dos Surradores 5, Lisboa',
    zone: 'Mouraria',
    category: 'tasca',
    price_range: '€€',
    latitude: 38.7148,
    longitude: -9.136,
    dishes: [{ name: 'Costelinhas de porco', must_try: true, source: 'personal' }],
  },
  {
    // SAMPLE — verify coords/scores
    name: 'Tasca do Chico',
    address: 'R. do Diário de Notícias 39, Lisboa',
    zone: 'Bairro Alto',
    category: 'tasca',
    price_range: '€',
    latitude: 38.711,
    longitude: -9.1448,
  },
  {
    // SAMPLE — verify coords/scores
    name: 'Cervejaria Trindade',
    address: 'R. Nova da Trindade 20C, Lisboa',
    zone: 'Chiado',
    category: 'cervejaria',
    price_range: '€€€',
    latitude: 38.7105,
    longitude: -9.142,
  },
  {
    // SAMPLE — verify coords/scores
    name: 'A Taberna da Rua das Flores',
    address: 'R. das Flores 103, Lisboa',
    zone: 'Chiado',
    category: 'tasca',
    price_range: '€€€',
    latitude: 38.709,
    longitude: -9.143,
    ratings: [{ source: 'thefork', score: 9.2, max_score: 10, review_count: 800 }],
  },
];
