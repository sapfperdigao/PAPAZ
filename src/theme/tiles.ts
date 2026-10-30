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

// Saturated tints (deeper than the light category-badge hues) so the motif
// reads over porcelain. Pinned by the spec.
const TINT: Record<Category, string> = {
  tasca: '#F4B740',
  cervejaria: '#1446C8',
  marisqueira: '#6FA8FF',
  other: '#64748B',
};

const BG = '#F3F6FC';

// djb2 string hash, folded to a non-negative 31-bit int. Deterministic.
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

export function restaurantTile(id: string, category: Category): Tile {
  return {
    motif: MOTIFS[hashString(id) % MOTIFS.length],
    tint: TINT[category] ?? TINT.other,
    bg: BG,
  };
}
