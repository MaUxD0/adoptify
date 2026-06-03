import { z } from 'zod'

export const createPetSchema = z.object({
  name: z.string().min(2),
  species: z.string().min(2),
  breed: z.string().optional(),
  age: z.coerce.number().min(0),
  size: z.string().optional(),
  gender: z.string().optional(),
  description: z.string().min(10),
  image_url: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

export const updatePetSchema = createPetSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'PENDING', 'ADOPTED']).optional(),
})

export const petIdParamSchema = z.object({
  id: z.string().uuid(),
})

export const listPetsQuerySchema = z.object({
  species: z.string().optional(),
  status: z.enum(['AVAILABLE', 'PENDING', 'ADOPTED']).optional(),
})
