import { usePets } from "../../hooks/usePets";

const DOG_EMOJI = "🐶";
const CAT_EMOJI = "🐱";

const PetFilters = () => {
  const { speciesFilter, setSpeciesFilter } = usePets();

  const categories = [
    { value: "Dog", label: "Dogs", emoji: DOG_EMOJI },
    { value: "Cat", label: "Cats", emoji: CAT_EMOJI },
  ];

  return (
    <div className="flex gap-3">
      {/* All button */}
      <button
        onClick={() => setSpeciesFilter("")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
          speciesFilter === ""
            ? "bg-pink-500 text-white shadow-md shadow-pink-200"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
      >
        🐾 All
      </button>

      {categories.map(({ value, label, emoji }) => {
        const active = speciesFilter === value;
        return (
          <button
            key={value}
            onClick={() => setSpeciesFilter(value)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
              active
                ? "bg-pink-500 text-white shadow-md shadow-pink-200 scale-105"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <span className="text-base">{emoji}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default PetFilters;