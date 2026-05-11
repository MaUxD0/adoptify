import { useEffect } from 'react';
import { useAdoptionContext } from '../providers/AdoptionProvider';
import { useAuth } from './useAuth';
import type { AdoptionFilters } from '../types/adoption.types';

/**
 * Hook for adopter-facing adoption list.
 * Automatically fetches on mount with optional filters.
 */
export function useAdoptions(filters?: AdoptionFilters) {
  const ctx = useAdoptionContext();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      ctx.fetchMyAdoptions(user.id, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, filters?.status, filters?.page, filters?.limit]);

  return {
    adoptions: ctx.adoptions,
    pagination: ctx.pagination,
    isLoading: ctx.isLoading,
    error: ctx.error,
    submit: ctx.submitAdoption,
    refetch: (filters?: AdoptionFilters) =>
      user?.id ? ctx.fetchMyAdoptions(user.id, filters) : Promise.resolve(),
  };
}

/**
 * Hook for shelter-facing adoption management.
 */
export function useShelterAdoptions(filters?: AdoptionFilters) {
  const ctx = useAdoptionContext();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      ctx.fetchShelterAdoptions(user.id, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, filters?.status, filters?.page, filters?.limit]);

  return {
    adoptions: ctx.adoptions,
    pagination: ctx.pagination,
    isLoading: ctx.isLoading,
    error: ctx.error,
    approve: ctx.approveAdoption,
    reject: ctx.rejectAdoption,
    refetch: (filters?: AdoptionFilters) =>
      user?.id ? ctx.fetchShelterAdoptions(user.id, filters) : Promise.resolve(),
  };
}