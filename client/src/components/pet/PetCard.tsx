import type { Pet } from "../../types/pet.types";
interface Props {
  pet: Pet;
}

const PetCard = ({ pet }: Props) => {
  return (
    <div className="border rounded-xl p-4 shadow">
      <img
        src={pet.image_url}
        alt={pet.name}
        className="w-full h-48 object-cover rounded-lg"
      />

      <h2 className="text-xl font-bold mt-4">
        {pet.name}
      </h2>

      <p>{pet.species}</p>

      <p>{pet.breed}</p>

      <p>{pet.age} years old</p>
    </div>
  );
};

export default PetCard;