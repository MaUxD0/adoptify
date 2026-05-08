import axiosInstance from "../api/axios";

export class PetsService {
  static async getAllPets() {
    const response = await axiosInstance.get("/pets");

    return response.data;
  }

  static async getPetById(id: string) {
    const response = await axiosInstance.get(
      `/pets/${id}`
    );

    return response.data;
  }
}