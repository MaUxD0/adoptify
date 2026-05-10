import { supabaseAdmin as supabase } from "../../config/supabase";

import {
  CreateAdoptionDto,
  AdoptionFilters,
  AdoptionStatuses,
} from "./adoptions.types";

export const adoptionsRepository = {
  async create(
    data: CreateAdoptionDto & {
      adopterId: string;
    }
  ) {
    const { data: adoption, error } = await supabase
      .from("adoption_requests")
      .insert([
        {
          pet_id: data.petId,
          adopter_id: data.adopterId,
          message: data.message,
          status: AdoptionStatuses.PENDING,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return adoption;
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from("adoption_requests")
      .select(`
        *,
        pets (
          shelter_id
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  },

  async findByAdopter(
    adopterId: string,
    filters: AdoptionFilters
  ) {
    let query = supabase
      .from("adoption_requests")
      .select("*")
      .eq("adopter_id", adopterId);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      data,
      total: data.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: 1,
    };
  },

  async findByShelter(
    shelterId: string,
    filters: AdoptionFilters
  ) {
    let query = supabase
      .from("adoption_requests")
      .select(`
        *,
        pets!inner (
          shelter_id
        )
      `)
      .eq("pets.shelter_id", shelterId);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      data,
      total: data.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: 1,
    };
  },

  async updateStatus(
  id: string,
  status: string,
  notes?: string
) {
    const { data, error } = await supabase
      .from("adoption_requests")
      .update({
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  async existsByPetAndAdopter(
    petId: string,
    adopterId: string
  ) {
    const { data, error } = await supabase
      .from("adoption_requests")
      .select("id")
      .eq("pet_id", petId)
      .eq("adopter_id", adopterId);

    if (error) throw error;

    return data.length > 0;
  },
};