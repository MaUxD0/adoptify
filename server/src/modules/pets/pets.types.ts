export interface CreatePetDTO {
  name: string;
  species: string;
  breed?: string;
  age: number;
  size?: string;
  gender?: string;
  description: string;
  image_url?: string;
}

export interface Pet {
  id: string;
  shelter_id: string;
  name: string;
  species: string;
  breed?: string;
  age: number;
  size?: string;
  gender?: string;
  description: string;
  image_url?: string;
  status: "AVAILABLE" | "PENDING" | "ADOPTED";
  created_at: string;
}