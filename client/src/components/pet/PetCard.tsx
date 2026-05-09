import {
  Link,
} from "react-router-dom";

import type { Pet } from "../../types/pet.types";

interface Props {
  pet: Pet;
}

const PetCard = ({ pet }: Props) => {
  return (
    <Link
      to={`/pets/${pet.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "16px",
          padding: "16px",
          width: "300px",
        }}
      >
        <img
          src={pet.image_url}
          alt={pet.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />

        <h2
          style={{
            fontSize: "24px",
            marginTop: "16px",
          }}
        >
          {pet.name}
        </h2>

        <p>{pet.species}</p>

        <p>{pet.breed}</p>

        <p>{pet.age} years old</p>
      </div>
    </Link>
  );
};

export default PetCard;