import { useQuery } from '@tanstack/react-query';
import { getDb } from '@/db/client';
import {
  getRestaurant,
  getRatings,
  getDishes,
  getWines,
  getVisits,
  getConsensus,
} from '@/db/repo';

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => getRestaurant(getDb(), id) ?? null,
  });
}

export function useConsensus(id: string) {
  return useQuery({
    queryKey: ['consensus', id],
    queryFn: async () => getConsensus(getDb(), id),
  });
}

export function useRatings(id: string) {
  return useQuery({ queryKey: ['ratings', id], queryFn: async () => getRatings(getDb(), id) });
}

export function useDishes(id: string) {
  return useQuery({ queryKey: ['dishes', id], queryFn: async () => getDishes(getDb(), id) });
}

export function useWines(id: string) {
  return useQuery({ queryKey: ['wines', id], queryFn: async () => getWines(getDb(), id) });
}

export function useVisits(id: string) {
  return useQuery({ queryKey: ['visits', id], queryFn: async () => getVisits(getDb(), id) });
}
