import { createContext } from "react";

import type { Pet } from "../types/pet.types";

interface PetsContextType {
  pets: Pet[];
  loading: boolean;
}

export const PetsContext =
  createContext<PetsContextType | null>(null);