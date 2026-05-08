import {
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import { PetsService } from "../services/pets.service";

import { PetsContext } from "../context/PetsContext";

import type { Pet } from "../types/pet.types";

interface Props {
  children: ReactNode;
}

export const PetsProvider = ({
  children,
}: Props) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response =
          await PetsService.getAllPets();

        setPets(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <PetsContext.Provider
      value={{
        pets,
        loading,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
};