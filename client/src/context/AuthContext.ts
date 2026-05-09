import { createContext } from "react";

export type UserRole = "adopter" | "shelter";

export interface AuthUser {
  id: string;
  role: UserRole;
  shelter_id?: string; // solo presente si role === "shelter"
}

interface AuthContextType {
  user: AuthUser | null;
}

export const AuthContext = createContext<AuthContextType>({ user: null });