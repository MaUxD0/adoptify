import { Link } from "react-router-dom";
import type { Pet } from "../../types/pet.types";

interface Props {
  pet: Pet;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80";

const PetCard = ({ pet }: Props) => {
  return (
    <Link
      to={`/pets/${pet.id}`}
      className="block no-underline group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={pet.image_url || FALLBACK_IMG}
            alt={pet.name}
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="p-3 flex items-start justify-between">
          <div>
            <h3 className="text-pink-500 font-bold text-sm leading-tight">{pet.name}</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {pet.gender ? `${pet.gender}, ` : ""}{pet.age}{pet.age === 1 ? " año" : " años"}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="text-gray-300 hover:text-pink-500 transition-colors flex-shrink-0 mt-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;