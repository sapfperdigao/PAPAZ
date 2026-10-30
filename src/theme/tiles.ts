import type { Category } from '@/domain';

// Generative azulejo-tile system (spec 2026-10-30-papaz-azulejo-redesign):
// every restaurant gets a deterministic tile — an azulejo motif in a category
// tint over porcelain — so cards/detail have colourful, on-brand imagery with
// zero photo data and zero network. Pure logic here; SVG rendering in
// src/components/Azulejo.tsx.

export type TileMotif = 'quatrefoil' | 'star' | 'wave';

export interface Tile {
  motif: TileMotif;
  tint: string;
  bg: string;
}

const MOTIFS: TileMotif[] = ['quatrefoil', 'star', 'wave'];

// Vibrant jewel-tone tints — every restaurant gets a colourful tile regardless
// of category (the dataset is mostly "other", so a category→tint map would make
// most tiles grey and defeat the "colourful, alive" goal). Category is still
// communicated by the badge, not the tile. All saturated enough to read as a
// motif over porcelain.
const TINTS = [
  '#1446C8', // cobalt
  '#2E8B9A', // teal
  '#7C3AED', // plum
  '#C98A1E', // amber-gold
  '#2E6BE0', // azure
  '#B23A8E', // raspberry
];

const BG = '#F3F6FC';

// djb2 string hash, folded to a non-negative 31-bit int. Deterministic.
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

// Deterministic from the id: tint from the jewel-tone set; motif seeded by
// category+id so same-colour neighbours still differ in pattern.
export function restaurantTile(id: string, category: Category): Tile {
  return {
    motif: MOTIFS[hashString(category + id) % MOTIFS.length],
    tint: TINTS[hashString(id) % TINTS.length],
    bg: BG,
  };
}
