import { chatApi } from '../api/chat.api';

export const chatService = {
  async getConversations() {
    const { data } = await chatApi.getConversations();
    return data.data || [];
  },

  async findOrCreateConversation(adopterId: string, shelterId: string) {
  const { data } = await chatApi.findOrCreateConversation(adopterId, shelterId);
  return data.data;
},

  async getMessages(chatId: string, page = 1, limit = 30) {
    const { data } = await chatApi.getMessages(chatId, page, limit);
    return {
      ...data,
      data: data.data || [],
    };
  },

  async sendMessage(chatId: string, content: string) {
    const { data } = await chatApi.sendMessage(chatId, content);
    return data.data;
  },
};