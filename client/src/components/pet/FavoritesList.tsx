import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";

export const FavoritesList = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
        <p className="text-2xl mb-2">💔</p>
        <p className="text-gray-400 text-xs font-medium">No favorites yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((pet) => (
        <div key={pet.id} className="group relative bg-white border border-gray-100 rounded-2xl p-2 flex items-center gap-3 hover:shadow-md transition-all">
          <img 
            src={pet.image_url || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80"} 
            className="w-12 h-12 rounded-xl object-cover" 
            alt={pet.name} 
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate">{pet.name}</h4>
            <p className="text-[10px] text-gray-400 truncate">{pet.breed || pet.species}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(pet);
            }}
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <button 
            onClick={() => navigate(`/pets/${pet.id}`)}
            className="absolute inset-0 z-0"
            aria-label={`View ${pet.name}`}
          />
        </div>
      ))}
    </div>
  );
};
