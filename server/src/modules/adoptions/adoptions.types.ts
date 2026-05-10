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
  status?: AdoptionStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}