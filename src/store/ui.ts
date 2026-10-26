import { create } from 'zustand';
import type { Category, PriceRange } from '@/domain';
import type { SortKey, VisitedFilter } from '@/db/repo';

export interface Filters {
  categories: Category[];
  prices: PriceRange[];
  visited: VisitedFilter;
  bookmarkedOnly: boolean;
  search: string;
}

const emptyFilters: Filters = {
  categories: [],
  prices: [],
  visited: 'all',
  bookmarkedOnly: false,
  search: '',
};

interface UiState {
  sort: SortKey;
  filters: Filters;
  setSort: (sort: SortKey) => void;
  setFilters: (patch: Partial<Filters>) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sort: 'rating',
  filters: emptyFilters,
  setSort: (sort) => set({ sort }),
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  resetFilters: () => set({ filters: emptyFilters }),
}));
