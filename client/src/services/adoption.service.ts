import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Adjunta el token de Supabase automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adoptionService = {
  // El backend saca el adopterId del token — no va en la URL
  async getAdopterAdoptions(_adopterId: string) {
    const { data } = await api.get('/adoptions/me');
    return data;
  },

  // El backend saca el shelterId del token — no va en la URL
  async getShelterAdoptions(_shelterId: string) {
    const { data } = await api.get('/adoptions/shelter');
    return data;
  },

  async createAdoption(dto: unknown) {
    const { data } = await api.post('/adoptions', dto);
    return data;
  },

  async approveAdoption(id: string, notes?: string) {
    const { data } = await api.patch(`/adoptions/${id}/approve`, { notes });
    return data;
  },

  async rejectAdoption(id: string, notes?: string) {
    const { data } = await api.patch(`/adoptions/${id}/reject`, { notes });
    return data;
  },

  async getAdoptionById(id: string) {
    const { data } = await api.get(`/adoptions/${id}`);
    return data;
  },
};