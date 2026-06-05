import { createContext } from 'react'
import type { Pet } from '../../shared/types/pet.types'

export interface FavoritesContextValue {
  favorites: Pet[]
  toggleFavorite: (pet: Pet) => void
  isFavorite: (petId: string) => boolean
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)
