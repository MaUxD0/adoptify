import {
  useState,
} from "react";

import { PetsService } from "../../services/pets.service";

const CreatePetPage = () => {
  const [name, setName] =
    useState("");

  const [species, setSpecies] =
    useState("");

  const [breed, setBreed] =
    useState("");

  const [age, setAge] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await PetsService.createPet({
        shelter_id:
          "29f6c1a2-0b4f-4561-ae65-8c3664096385",

        name,

        species,

        breed,

        age: Number(age),

        description,

        image_url: imageUrl,
      });

      alert("Pet created!");

      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      console.error(error);

      alert(
        "Error creating pet"
      );
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>Create Pet</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Species"
          value={species}
          onChange={(e) =>
            setSpecies(
              e.target.value
            )
          }
        />

        <input
          placeholder="Breed"
          value={breed}
          onChange={(e) =>
            setBreed(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
        />

        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(
              e.target.value
            )
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <button type="submit">
          Create Pet
        </button>
      </form>
    </div>
  );
};

export default CreatePetPage;