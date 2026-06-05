import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../api/supabase'
import { PetsContext } from '../context/pets/PetsContext'
import {
  PETS_REALTIME_CHANNEL,
  type PetRealtimeEvent,
} from '../shared/constants/realtime'
import type { Pet } from '../shared/types/pet.types'
import { PetsService } from '../services/pets.service'

interface Props {
  children: ReactNode
}

interface RealtimePayload {
  pet?: Pet
  petId?: string
}

export const PetsProvider = ({ children }: Props) => {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [speciesFilter, setSpeciesFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const refreshPets = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await PetsService.getAll()
      setPets(data)
    } catch {
      const message = 'No se pudieron cargar las mascotas'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshPets()
  }, [refreshPets])

  useEffect(() => {
    const channel = supabase.channel(PETS_REALTIME_CHANNEL)

    const handleEvent = (event: PetRealtimeEvent) => (message: { payload: RealtimePayload }) => {
      const { pet, petId } = message.payload ?? {}

      if (event === 'pet:created' && pet) {
        setPets((current) => [pet, ...current.filter((p) => p.id !== pet.id)])
        toast.success(`Nueva mascota: ${pet.name}`)
        return
      }

      if (event === 'pet:updated' && pet) {
        setPets((current) => current.map((p) => (p.id === pet.id ? pet : p)))
        return
      }

      if (event === 'pet:deleted' && petId) {
        setPets((current) => current.filter((p) => p.id !== petId))
        toast('Mascota eliminada del catálogo')
      }
    }

    channel
      .on('broadcast', { event: 'pet:created' }, handleEvent('pet:created'))
      .on('broadcast', { event: 'pet:updated' }, handleEvent('pet:updated'))
      .on('broadcast', { event: 'pet:deleted' }, handleEvent('pet:deleted'))
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSpecies = !speciesFilter || pet.species.toLowerCase() === speciesFilter.toLowerCase()
      const matchesSearch = !searchQuery.trim() || pet.breed?.toLowerCase().includes(searchQuery.toLowerCase().trim())
      return matchesSpecies && matchesSearch
    })
  }, [pets, speciesFilter, searchQuery])

  return (
    <PetsContext.Provider
      value={{
        pets,
        filteredPets,
        loading,
        error,
        speciesFilter,
        setSpeciesFilter,
        searchQuery,
        setSearchQuery,
        refreshPets,
      }}
    >
      {children}
    </PetsContext.Provider>
  )
}

