import { createContext } from 'react'
import type { Pet } from '../../shared/types/pet.types'

export interface PetsContextValue {
  pets: Pet[]
  filteredPets: Pet[]
  loading: boolean
  error: string | null
  speciesFilter: string
  setSpeciesFilter: (species: string) => void
  refreshPets: () => Promise<void>
}

export const PetsContext = createContext<PetsContextValue | null>(null)
