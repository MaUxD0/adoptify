export type PetStatus = 'AVAILABLE' | 'PENDING' | 'ADOPTED'

export interface ShelterSummary {
  id: string
  name: string
  email: string
}

export interface Pet {
  id: string
  shelter_id?: string
  name: string
  species: string
  breed?: string
  age: number
  size?: string
  gender?: string
  description: string
  image_url?: string
  latitude?: number
  longitude?: number
  status?: PetStatus
  created_at?: string
  shelter?: ShelterSummary
}
