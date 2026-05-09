import {
  useParams,
} from "react-router-dom";

import { usePets } from "../../hooks/usePets";

const PetDetailsPage = () => {
  const { id } = useParams();

  const { pets } = usePets();

  const pet = pets.find(
    (pet) => pet.id === id
  );

  if (!pet) {
    return <p>Pet not found</p>;
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <img
        src={pet.image_url}
        alt={pet.name}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "16px",
        }}
      />

      <h1
        style={{
          fontSize: "40px",
          marginTop: "24px",
        }}
      >
        {pet.name}
      </h1>

      <p>
        <strong>Species:</strong>{" "}
        {pet.species}
      </p>

      <p>
        <strong>Breed:</strong>{" "}
        {pet.breed}
      </p>

      <p>
        <strong>Age:</strong>{" "}
        {pet.age} years old
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {pet.description}
      </p>

      <button
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        Adopt
      </button>
    </div>
  );
};

export default PetDetailsPage;