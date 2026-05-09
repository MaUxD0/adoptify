import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { usePets } from "../../hooks/usePets";

import { PetsService } from "../../services/pets.service";

const PetDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { pets } = usePets();

  const pet = pets.find(
    (pet) => pet.id === id
  );

  const handleDelete =
    async () => {
      if (!id) return;

      try {
        await PetsService.deletePet(id);

        alert("Pet deleted");

        navigate("/");
      } catch (error) {
        console.error(error);

        alert(
          "Error deleting pet"
        );
      }
    };

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

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <button>
          Adopt
        </button>
        <button
        onClick={() =>
        navigate(
      `/shelter/edit-pet/${pet.id}`
    )
  }
>
  Edit Pet
</button>

        <button
          onClick={handleDelete}
        >
          Delete Pet
        </button>
      </div>
    </div>
  );
};

export default PetDetailsPage;