import PetCard from "../../components/pet/PetCard";

import PetFilters from "../../components/pet/PetFilters";

import { usePets } from "../../hooks/usePets";

const HomePage = () => {
  const {
    filteredPets,
    loading,
  } = usePets();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <PetFilters />

      <div
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {filteredPets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;