import express from 'express';
import { adoptionsController } from './adoptions.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createAdoptionSchema,
  updateAdoptionStatusSchema,
  adoptionIdParamSchema,
  adoptionFiltersSchema,
} from './adoptions.validators';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  requireRole('ADOPTER'),
  validate({ body: createAdoptionSchema }),
  adoptionsController.createAdoption,
);

router.get(
  '/me',
  requireRole('ADOPTER'),
  validate({ query: adoptionFiltersSchema }),
  adoptionsController.getMyAdoptions,
);

router.get(
  '/shelter',
  requireRole('SHELTER'),
  validate({ query: adoptionFiltersSchema }),
  adoptionsController.getShelterAdoptions,
);


router.patch(
  '/:id/approve',
  requireRole('SHELTER'),
  validate({ params: adoptionIdParamSchema }),
  adoptionsController.approveAdoption,
);


router.patch(
  '/:id/reject',
  requireRole('SHELTER'),
  validate({ params: adoptionIdParamSchema, body: updateAdoptionStatusSchema }),
  adoptionsController.rejectAdoption,
);



router.get(
  '/:id',
  validate({ params: adoptionIdParamSchema }),
  adoptionsController.getAdoptionById,
);

export default router;
