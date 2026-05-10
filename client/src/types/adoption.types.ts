export const AdoptionStatuses = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type AdoptionStatus =
  (typeof AdoptionStatuses)[keyof typeof AdoptionStatuses];

export interface Adoption {
  id: string;
  pet_id: string;
  adopter_id: string;
  status: AdoptionStatus;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdoptionDto {
  petId: string;
  message?: string;
}

export interface AdoptionFilters {
  status?: AdoptionStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedAdoptions {
  data: Adoption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}