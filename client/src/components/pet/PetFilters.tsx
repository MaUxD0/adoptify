import { usePets } from "../../hooks/usePets";

const PetFilters = () => {
  const {
    speciesFilter,
    setSpeciesFilter,
  } = usePets();

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      <select
        value={speciesFilter}
        onChange={(e) =>
          setSpeciesFilter(e.target.value)
        }
      >
        <option value="">
          All species
        </option>

        <option value="Dog">
          Dogs
        </option>

        <option value="Cat">
          Cats
        </option>
      </select>
    </div>
  );
};

export default PetFilters;