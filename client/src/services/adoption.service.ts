import axios from "axios";

const API = "http://localhost:5000/api";

export const adoptionService = {
  async createAdoption(dto: any) {
    const { data } = await axios.post(`${API}/adoptions`, dto);
    return data;
  },

  async getAdopterAdoptions(adopterId: string) {
    const { data } = await axios.get(`${API}/adoptions/adopter/${adopterId}`);
    return data;
  },

  async getShelterAdoptions(shelterId: string) {
    const { data } = await axios.get(`${API}/adoptions/shelter/${shelterId}`);
    return data;
  },

  async approveAdoption(id: string, notes?: string) {
    const { data } = await axios.patch(`${API}/adoptions/${id}/approve`, { notes });
    return data;
  },

  async rejectAdoption(id: string, notes?: string) {
    const { data } = await axios.patch(`${API}/adoptions/${id}/reject`, { notes });
    return data;
  },

  async getAdoptionById(id: string) {
    const { data } = await axios.get(`${API}/adoptions/${id}`);
    return data;
  },
};