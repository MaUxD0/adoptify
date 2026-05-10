import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const chatApi = {
  getConversations() {
    return api.get('/chat/conversations');
  },

  getMessages(chatId: string, page = 1, limit = 30) {
    return api.get(`/chat/conversations/${chatId}/messages`, {
      params: { page, limit },
    });
  },

  sendMessage(chatId: string, content: string) {
    return api.post(`/chat/conversations/${chatId}/messages`, { content });
  },
};