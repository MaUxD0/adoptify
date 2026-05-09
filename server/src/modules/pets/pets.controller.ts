import type {
  Request,
  Response,
} from "express";

import { PetsService } from "./pets.service";

import { createPetSchema } from "./pets.schemas";

export class PetsController {
  static async getAllPets(
    req: Request,
    res: Response
  ) {
    try {
      const pets =
        await PetsService.getAllPets();

      res.status(200).json({
        success: true,
        data: pets,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error",
      });
    }
  }

  static async getPetById(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      if (typeof id !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }

      const pet =
        await PetsService.getPetById(
          id
        );

      res.status(200).json({
        success: true,
        data: pet,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error",
      });
    }
  }

  static async createPet(
    req: Request,
    res: Response
  ) {
    try {
      console.log(req.body);

      const validation =
        createPetSchema.safeParse(
          req.body
        );

      if (!validation.success) {
        console.log(
          validation.error.flatten()
        );

        return res.status(400).json({
          success: false,
          errors:
            validation.error.flatten(),
        });
      }

      const shelterId =
        req.body.shelter_id as string;

      const pet =
        await PetsService.createPet(
          shelterId,
          validation.data as any
        );

      res.status(201).json({
        success: true,
        data: pet,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error",
      });
    }
  }
}
