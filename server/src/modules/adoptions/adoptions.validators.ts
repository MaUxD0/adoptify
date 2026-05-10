import { z } from "zod";
import { AdoptionStatuses } from "./adoptions.types";

const adoptionStatusValues = [
  AdoptionStatuses.PENDING,
  AdoptionStatuses.APPROVED,
  AdoptionStatuses.REJECTED,
] as const;

const adoptionStatusUpdateValues = [
  AdoptionStatuses.APPROVED,
  AdoptionStatuses.REJECTED,
] as const;

export const createAdoptionSchema = z.object({
  petId: z.string().uuid({
    message: "Invalid pet ID",
  }),

  message: z
    .string()
    .max(500, "Message too long")
    .optional(),
});

export const updateAdoptionStatusSchema = z.object({
  status: z.enum(adoptionStatusUpdateValues),

  notes: z
    .string()
    .max(500, "Notes too long")
    .optional(),
});

export const adoptionIdParamSchema = z.object({
  id: z.string().uuid({
    message: "Invalid adoption ID",
  }),
});

export const adoptionFiltersSchema = z.object({
  status: z.enum(adoptionStatusValues).optional(),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateAdoptionInput =
  z.infer<typeof createAdoptionSchema>;

export type UpdateAdoptionStatusInput =
  z.infer<typeof updateAdoptionStatusSchema>;

export type AdoptionFiltersInput =
  z.infer<typeof adoptionFiltersSchema>;
