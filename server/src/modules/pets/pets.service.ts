import { supabase } from "../../config/supabase";

import type {
  CreatePetDTO,
} from "./pets.types";

export class PetsService {
  static async getAllPets() {
    const { data, error } =
      await supabase
        .from("pets")
        .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getPetById(id: string) {
    const { data, error } =
      await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async createPet(
    shelterId: string,
    data: CreatePetDTO
  ) {
    const { data: pet, error } =
      await supabase
        .from("pets")
        .insert({
          ...data,
          shelter_id: shelterId,
        })
        .select()
        .single();

    if (error) {
      throw new Error(error.message);
    }

    return pet;
  }

  static async deletePet(id: string) {
    const { error } =
      await supabase
        .from("pets")
        .delete()
        .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}