import { useContext } from "react";

import { PetsContext } from "../context/PetsContext";

export const usePets = () => {
  const context = useContext(PetsContext);

  if (!context) {
    throw new Error(
      "usePets must be used within PetsProvider"
    );
  }

  return context;
};