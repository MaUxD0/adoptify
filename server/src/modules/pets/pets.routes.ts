import { Router } from "express";

import { PetsController } from "./pets.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  PetsController.getAllPets
);

router.get(
  "/:id",
  PetsController.getPetById
);


router.post(
    "/", 
    authMiddleware, PetsController.createPet);

router.patch(
  "/:id",
  PetsController.updatePet
);

router.delete(
  "/:id",
  PetsController.deletePet
);

export default router;