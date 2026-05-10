import { useEffect } from 'react';
import { useAdoptionContext } from '../providers/AdoptionProvider';
import type { AdoptionFilters } from '../types/adoption.types';

/**
 * Hook for adopter-facing adoption list.
 * Automatically fetches on mount with optional filters.
 */
export function useAdoptions(filters?: AdoptionFilters) {
  const ctx = useAdoptionContext();

  useEffect(() => {
    ctx.fetchMyAdoptions(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.page, filters?.limit]);

  return {
    adoptions: ctx.adoptions,
    pagination: ctx.pagination,
    isLoading: ctx.isLoading,
    error: ctx.error,
    submit: ctx.submitAdoption,
    refetch: ctx.fetchMyAdoptions,
  };
}

/**
 * Hook for shelter-facing adoption management.
 */
export function useShelterAdoptions(filters?: AdoptionFilters) {
  const ctx = useAdoptionContext();

  useEffect(() => {
    ctx.fetchShelterAdoptions(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.page, filters?.limit]);

  return {
    adoptions: ctx.adoptions,
    pagination: ctx.pagination,
    isLoading: ctx.isLoading,
    error: ctx.error,
    approve: ctx.approveAdoption,
    reject: ctx.rejectAdoption,
    refetch: ctx.fetchShelterAdoptions,
  };
}