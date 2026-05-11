export const AdoptionStatuses = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type AdoptionStatus =
  (typeof AdoptionStatuses)[keyof typeof AdoptionStatuses];

export interface CreateAdoptionDto {
  petId: string;
  message?: string;
}

export interface UpdateAdoptionStatusDto {
  status:
    | typeof AdoptionStatuses.APPROVED
    | typeof AdoptionStatuses.REJECTED;

  notes?: string;
}

export interface AdoptionFilters {
  status?: AdoptionStatus | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Adoption {
  id: string;
  pet_id: string;
  adopter_id: string;
  status: AdoptionStatus;
  message?: string;
  created_at: string;
  updated_at: string;
  pets?: {
    shelter_id: string;
  };
}