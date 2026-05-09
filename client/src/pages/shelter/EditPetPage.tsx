import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { usePets } from "../../hooks/usePets";

import { PetsService } from "../../services/pets.service";

const EditPetPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { pets } = usePets();

  const pet = pets.find(
    (pet) => pet.id === id
  );

  const [name, setName] =
    useState(pet?.name || "");

  const [species, setSpecies] =
    useState(pet?.species || "");

  const [breed, setBreed] =
    useState(pet?.breed || "");

  const [age, setAge] =
    useState(
      pet?.age?.toString() || ""
    );

  const [description, setDescription] =
    useState(
      pet?.description || ""
    );

  const [imageUrl, setImageUrl] =
    useState(
      pet?.image_url || ""
    );

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (!id) return;

      try {
        await PetsService.updatePet(
          id,
          {
            name,
            species,
            breed,
            age: Number(age),
            description,
            image_url: imageUrl,
          }
        );

        alert("Pet updated");

        navigate(`/pets/${id}`);
      } catch (error) {
        console.error(error);

        alert(
          "Error updating pet"
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
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>Edit Pet</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          value={species}
          onChange={(e) =>
            setSpecies(
              e.target.value
            )
          }
        />

        <input
          value={breed}
          onChange={(e) =>
            setBreed(e.target.value)
          }
        />

        <input
          type="number"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
        />

        <input
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(
              e.target.value
            )
          }
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <button type="submit">
          Update Pet
        </button>
      </form>
    </div>
  );
};

export default EditPetPage;