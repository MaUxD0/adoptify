import { Router } from "express";
import { PetsController } from "./pets.controller";

const router = Router();


router.get("/", PetsController.getAllPets);

router.get("/:id", PetsController.getPetById);

router.post("/", PetsController.createPet);

router.delete("/:id", PetsController.deletePet);

export default router;