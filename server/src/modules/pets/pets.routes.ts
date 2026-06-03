import { Router } from 'express'
import { asyncHandler } from '../../middlewares/async-handler.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireRole } from '../../middlewares/role.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { RealtimeService } from '../../shared/realtime/realtime.service'
import { PetsController } from './pets.controller'
import { PetsRepository } from './pets.repository'
import {
  createPetSchema,
  listPetsQuerySchema,
  petIdParamSchema,
  updatePetSchema,
} from './pets.schemas'
import { PetsService } from './pets.service'

const petsRepository = new PetsRepository()
const realtimeService = new RealtimeService()
const petsService = new PetsService(petsRepository, realtimeService)
const petsController = new PetsController(petsService)

const router = Router()

router.get(
  '/',
  validate({ query: listPetsQuerySchema }),
  asyncHandler(petsController.list),
)

router.get(
  '/:id',
  validate({ params: petIdParamSchema }),
  asyncHandler(petsController.getById),
)

router.post(
  '/',
  authMiddleware,
  requireRole('SHELTER'),
  validate({ body: createPetSchema }),
  asyncHandler(petsController.create),
)

router.patch(
  '/:id',
  authMiddleware,
  requireRole('SHELTER'),
  validate({ params: petIdParamSchema, body: updatePetSchema }),
  asyncHandler(petsController.update),
)

router.delete(
  '/:id',
  authMiddleware,
  requireRole('SHELTER'),
  validate({ params: petIdParamSchema }),
  asyncHandler(petsController.remove),
)

export { realtimeService }
export default router
