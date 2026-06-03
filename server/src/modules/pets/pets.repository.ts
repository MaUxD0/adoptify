import { supabaseAdmin } from '../../config/supabase'
import type {
  CreatePetDTO,
  ListPetsFilters,
  Pet,
  UpdatePetDTO,
} from './pets.types'

const PET_WITH_SHELTER_SELECT = `
  *,
  shelter:users (
    id,
    name,
    email
  )
`

export class PetsRepository {
  async findAll(filters: ListPetsFilters = {}): Promise<Pet[]> {
    const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(
      'get_pets_with_shelter',
      { p_species: filters.species ?? null },
    )

    if (!rpcError && rpcData) {
      const list = (Array.isArray(rpcData) ? rpcData : []) as Pet[]
      return this.applyStatusFilter(list, filters.status)
    }

    let query = supabaseAdmin
      .from('pets')
      .select(PET_WITH_SHELTER_SELECT)
      .order('created_at', { ascending: false })

    if (filters.species) {
      query = query.ilike('species', filters.species)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return (data ?? []) as Pet[]
  }

  async findById(id: string): Promise<Pet> {
    const { data, error } = await supabaseAdmin
      .from('pets')
      .select(PET_WITH_SHELTER_SELECT)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Pet
  }

  async create(shelterId: string, payload: CreatePetDTO): Promise<Pet> {
    const { data, error } = await supabaseAdmin
      .from('pets')
      .insert({
        ...payload,
        shelter_id: shelterId,
        status: 'AVAILABLE',
      })
      .select(PET_WITH_SHELTER_SELECT)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Pet
  }

  async update(id: string, payload: UpdatePetDTO): Promise<Pet> {
    const { data, error } = await supabaseAdmin
      .from('pets')
      .update(payload)
      .eq('id', id)
      .select(PET_WITH_SHELTER_SELECT)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data as Pet
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin.from('pets').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }

  async belongsToShelter(petId: string, shelterId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('pets')
      .select('id')
      .eq('id', petId)
      .eq('shelter_id', shelterId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    return Boolean(data)
  }

  private applyStatusFilter(pets: Pet[], status?: string): Pet[] {
    if (!status) return pets
    return pets.filter((pet) => pet.status === status)
  }
}
