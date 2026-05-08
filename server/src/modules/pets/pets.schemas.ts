import { z } from "zod";

export const createPetSchema = z.object({
  name: z.string().min(2),

  species: z.string().min(2),

  breed: z.string().optional(),

  age: z.number().min(0),

  size: z.string().optional(),

  gender: z.string().optional(),

  description: z.string().min(10),

  image_url: z.string().optional(),
});