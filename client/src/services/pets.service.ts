import axios from '../api/axios'
import type { Pet } from '../shared/types/pet.types'

interface PetsApiResponse {
  success: boolean
  data: Pet[]
}

interface PetApiResponse {
  success: boolean
  data: Pet
}

export class PetsService {
  static async getAll(species?: string): Promise<Pet[]> {
    const { data } = await axios.get<PetsApiResponse>('/pets', {
      params: species ? { species } : undefined,
    })
    return data.data ?? []
  }

  static async getPetById(id: string): Promise<Pet | null> {
    const { data } = await axios.get<PetApiResponse>(`/pets/${id}`)
    return data.data ?? null
  }

  static async createPet(payload: unknown): Promise<Pet> {
    const { data } = await axios.post<PetApiResponse>('/pets', payload)
    return data.data
  }

  static async updatePet(id: string, payload: unknown): Promise<Pet> {
    const { data } = await axios.patch<PetApiResponse>(`/pets/${id}`, payload)
    return data.data
  }

  static async deletePet(id: string): Promise<any> {
    const { data } = await axios.delete(`/pets/${id}`)
    return data
  }
}

