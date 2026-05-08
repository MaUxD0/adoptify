import PetCard from "../../components/pet/PetCard";

import { usePets } from "../../hooks/usePets";

const HomePage = () => {
  const { pets, loading } = usePets();

  if (loading) {
    return <p>Loading pets...</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {pets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
        />
      ))}
    </div>
  );
};

export default HomePage;