import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { adoptionService } from '../services/adoption.service';
import type {
  Adoption,
  AdoptionFilters,
  CreateAdoptionDto,
  PaginatedAdoptions,
} from '../types/adoption.types';

// ── Context shape ─────────────────────────────────────────────────────────────

interface AdoptionContextValue {
  // State
  adoptions: Adoption[];
  pagination: Omit<PaginatedAdoptions, 'data'> | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyAdoptions: (filters?: AdoptionFilters) => Promise<void>;
  fetchShelterAdoptions: (filters?: AdoptionFilters) => Promise<void>;
  submitAdoption: (payload: CreateAdoptionDto) => Promise<Adoption | null>;
  approveAdoption: (id: string, notes?: string) => Promise<void>;
  rejectAdoption: (id: string, notes?: string) => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AdoptionContext = createContext<AdoptionContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AdoptionProvider({ children }: { children: ReactNode }) {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedAdoptions, 'data'> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown, fallback: string) => {
    const message = err instanceof Error ? err.message : fallback;
    setError(message);
    toast.error(message);
  };

  const fetchMyAdoptions = useCallback(async (filters?: AdoptionFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, ...meta } = await adoptionService.getMyAdoptions(filters);
      setAdoptions(data || []);
      setPagination(meta);
    } catch (err) {
      handleError(err, 'Failed to load your adoption requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchShelterAdoptions = useCallback(async (filters?: AdoptionFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, ...meta } = await adoptionService.getShelterAdoptions(filters);
      setAdoptions(data || []);
      setPagination(meta);
    } catch (err) {
      handleError(err, 'Failed to load shelter requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAdoption = useCallback(
    async (payload: CreateAdoptionDto): Promise<Adoption | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const adoption = await adoptionService.createAdoption(payload);
        toast.success('Adoption request submitted successfully!');
        return adoption;
      } catch (err) {
        handleError(err, 'Failed to submit adoption request');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const approveAdoption = useCallback(async (id: string, notes?: string) => {
    try {
      const updated = await adoptionService.approveAdoption(id, notes);
      setAdoptions((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success('Adoption request approved!');
    } catch (err) {
      handleError(err, 'Failed to approve adoption');
    }
  }, []);

  const rejectAdoption = useCallback(async (id: string, notes?: string) => {
    try {
      const updated = await adoptionService.rejectAdoption(id, notes);
      setAdoptions((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success('Adoption request rejected');
    } catch (err) {
      handleError(err, 'Failed to reject adoption');
    }
  }, []);

  return (
    <AdoptionContext.Provider
      value={{
        adoptions,
        pagination,
        isLoading,
        error,
        fetchMyAdoptions,
        fetchShelterAdoptions,
        submitAdoption,
        approveAdoption,
        rejectAdoption,
      }}
    >
      {children}
    </AdoptionContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAdoptionContext(): AdoptionContextValue {
  const ctx = useContext(AdoptionContext);
  if (!ctx) {
    throw new Error('useAdoptionContext must be used within AdoptionProvider');
  }
  return ctx;
}
