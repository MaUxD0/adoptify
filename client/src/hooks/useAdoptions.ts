import { useEffect } from 'react';
import { useAdoptionContext } from '../providers/AdoptionProvider';
import type { AdoptionFilters } from '../types/adoption.types';

// TODO: Replace with real auth context value once auth module is integrated
const CURRENT_USER_ID = 'REPLACE_WITH_AUTH_CONTEXT';

/**
 * Hook for adopter-facing adoption list.
 * Automatically fetches on mount with optional filters.
 */
export function useAdoptions(filters?: AdoptionFilters) {
  const ctx = useAdoptionContext();

  useEffect(() => {
    ctx.fetchMyAdoptions(CURRENT_USER_ID, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.page, filters?.limit]);

  return {
    adoptions: ctx.adoptions,
    pagination: ctx.pagination,
    isLoading: ctx.isLoading,
    error: ctx.error,
    submit: ctx.submitAdoption,
    refetch: (filters?: AdoptionFilters) => ctx.fetchMyAdoptions(CURRENT_USER_ID, filters),
  };
}

/**
 * Hook for shelter-facing adoption management.
 */
export function useShelterAdoptions(filters?: AdoptionFilters) {
  const ctx = useAdoptionContext();

  useEffect(() => {
    ctx.fetchShelterAdoptions(CURRENT_USER_ID, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.page, filters?.limit]);

  return {
    adoptions: ctx.adoptions,
    pagination: ctx.pagination,
    isLoading: ctx.isLoading,
    error: ctx.error,
    approve: ctx.approveAdoption,
    reject: ctx.rejectAdoption,
    refetch: (filters?: AdoptionFilters) => ctx.fetchShelterAdoptions(CURRENT_USER_ID, filters),
  };
}