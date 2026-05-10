import api from '../api/axios';
import type {
  Adoption,
  CreateAdoptionDto,
  AdoptionFilters,
  PaginatedAdoptions,
} from '../types/adoption.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedApiResponse extends PaginatedAdoptions {
  success: boolean;
}

export const adoptionService = {
  async createAdoption(payload: CreateAdoptionDto): Promise<Adoption> {
    const { data } = await api.post<ApiResponse<Adoption>>('/adoptions', payload);
    return data.data;
  },

  async getMyAdoptions(filters?: AdoptionFilters): Promise<PaginatedAdoptions> {
    const { data } = await api.get<PaginatedApiResponse>('/adoptions/me', {
      params: filters,
    });
    const { success: _success, ...paginated } = data;
    return {
      ...paginated,
      data: paginated.data || [],
    };
  },

  async getShelterAdoptions(filters?: AdoptionFilters): Promise<PaginatedAdoptions> {
    const { data } = await api.get<PaginatedApiResponse>('/adoptions/shelter', {
      params: filters,
    });
    const { success: _success, ...paginated } = data;
    return {
      ...paginated,
      data: paginated.data || [],
    };
  },

  async getAdoptionById(id: string): Promise<Adoption> {
    const { data } = await api.get<ApiResponse<Adoption>>(`/adoptions/${id}`);
    return data.data;
  },

  async approveAdoption(id: string, notes?: string): Promise<Adoption> {
    const { data } = await api.patch<ApiResponse<Adoption>>(`/adoptions/${id}/approve`, {
      notes,
    });
    return data.data;
  },

  async rejectAdoption(id: string, notes?: string): Promise<Adoption> {
    const { data } = await api.patch<ApiResponse<Adoption>>(`/adoptions/${id}/reject`, {
      notes,
    });
    return data.data;
  },
};