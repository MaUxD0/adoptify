import { supabase } from "../../config/supabase";
import { CreatePetDTO } from "./pets.types";

export class PetsService {
  static async getAllPets() {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getPetById(id: string) {
    const { data, error } = await supabase
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
    petData: CreatePetDTO
  ) {
    const { data, error } = await supabase
      .from("pets")
      .insert([
        {
          shelter_id: shelterId,
          ...petData,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}