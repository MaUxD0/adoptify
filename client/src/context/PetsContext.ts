import { createContext } from "react";

import type { Pet } from "../types/pet.types";

interface PetsContextType {
  pets: Pet[];

  filteredPets: Pet[];

  loading: boolean;

  speciesFilter: string;

  setSpeciesFilter: (
    value: string
  ) => void;
}

export const PetsContext =
  createContext<PetsContextType | null>(null);