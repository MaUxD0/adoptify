import { Link } from 'react-router-dom'
import type { Pet } from '../../shared/types/pet.types'

interface PetCardProps {
  pet: Pet
  onFavorite?: (petId: string) => void
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80'

export const PetCard = ({ pet, onFavorite }: PetCardProps) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite?.(pet.id)
  }

  return (
    <Link
      to={`/pets/${pet.id}`}
      className="block no-underline group"
    >
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="relative overflow-hidden">
          <img
            src={pet.image_url || FALLBACK_IMG}
            alt={pet.name}
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-3 flex items-start justify-between">
          <div>
            <h3 className="text-pink-500 font-bold text-sm leading-tight">{pet.name}</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {pet.breed && <span className="text-gray-600 font-medium block">{pet.breed}</span>}
              {pet.gender ? `${pet.gender}, ` : ''}
              {pet.age}
              {pet.age === 1 ? ' año' : ' años'}
            </p>
            <p className="text-gray-400 text-xs mt-0.5 capitalize">{pet.species}</p>
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            className="text-gray-300 hover:text-pink-500 transition-colors flex-shrink-0 mt-0.5"
            aria-label={`Marcar favorito a ${pet.name}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
      </article>
    </Link>
  )
}

export default PetCard