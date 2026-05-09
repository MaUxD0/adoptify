import axiosInstance from "../api/axios";

export class PetsService {
  static async getAllPets() {
    const response =
      await axiosInstance.get("/pets");

    return response.data.data;
  }

  static async getPetById(id: string) {
    const response =
      await axiosInstance.get(
        `/pets/${id}`
      );

    return response.data.data;
  }

  static async createPet(
    data: unknown
  ) {
    const response =
      await axiosInstance.post(
        "/pets",
        data
      );

    return response.data.data;
  }

  static async deletePet(id: string) {
    const response =
      await axiosInstance.delete(
        `/pets/${id}`
      );

    return response.data;
  }
}