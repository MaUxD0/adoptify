import { useState, useEffect, type ReactNode, useCallback } from 'react'
import { FavoritesContext } from '../context/favorites/FavoritesContext'
import type { Pet } from '../shared/types/pet.types'
import toast from 'react-hot-toast'

interface Props {
  children: ReactNode
}

export const FavoritesProvider = ({ children }: Props) => {
  const [favorites, setFavorites] = useState<Pet[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('adoptify_favorites')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading favorites', e)
      }
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('adoptify_favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((pet: Pet) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === pet.id)
      if (exists) {
        toast.success(`Removed ${pet.name} from favorites`)
        return prev.filter((p) => p.id !== pet.id)
      } else {
        toast.success(`Added ${pet.name} to favorites! ❤️`)
        return [...prev, pet]
      }
    })
  }, [])

  const isFavorite = useCallback((petId: string) => {
    return favorites.some((p) => p.id === petId)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
