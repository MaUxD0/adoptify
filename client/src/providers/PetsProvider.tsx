import {
  useEffect,
  useMemo,
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

  const [loading, setLoading] =
    useState(true);

  const [
    speciesFilter,
    setSpeciesFilter,
  ] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response =
          await PetsService.getAllPets();

        setPets(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      if (
        speciesFilter &&
        pet.species !== speciesFilter
      ) {
        return false;
      }

      return true;
    });
  }, [pets, speciesFilter]);

  return (
    <PetsContext.Provider
      value={{
        pets,

        filteredPets,

        loading,

        speciesFilter,

        setSpeciesFilter,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
};