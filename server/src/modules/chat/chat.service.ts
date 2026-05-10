import { chatRepository } from './chat.repository';

export class ConversationNotFoundError extends Error {
  constructor(id: string) {
    super(`Conversation ${id} not found`);
    this.name = 'ConversationNotFoundError';
  }
}

export class ConversationForbiddenError extends Error {
  constructor() {
    super('You are not a participant in this conversation');
    this.name = 'ConversationForbiddenError';
  }
}

export const chatService = {
  async getUserConversations(userId: string) {
    const conversations = await chatRepository.findConversationsByUser(userId);
    return conversations.map((conv: any) => ({
      id: conv.id,
      adopter_id: conv.adopter_id,
      shelter_id: conv.shelter_id,
      pet_id: conv.pet_id,
      created_at: conv.created_at,
      adopter: conv.adopter,
      shelter: conv.shelter,
      pet: conv.pet,
    }));
  },

  async getConversationMessages(conversationId: string, userId: string, page: number, limit: number) {
    const isParticipant = await chatRepository.isParticipant(conversationId, userId);
    if (!isParticipant) throw new ConversationForbiddenError();

    const [messages] = await Promise.all([
      chatRepository.getMessages(conversationId, page, limit),
      chatRepository.markMessagesAsRead(conversationId, userId),
    ]);

    return messages;
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const isParticipant = await chatRepository.isParticipant(conversationId, senderId);
    if (!isParticipant) throw new ConversationForbiddenError();

    return chatRepository.sendMessage(conversationId, senderId, content);
  },

  async getConversationById(conversationId: string, userId: string) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new ConversationNotFoundError(conversationId);

    const isParticipant = await chatRepository.isParticipant(conversationId, userId);
    if (!isParticipant) throw new ConversationForbiddenError();

    return conversation;
  },
};