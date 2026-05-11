export interface SendMessageDto {
  content: string;
}

export interface ChatWithLastMessage {
  id: string;
  adopter_id: string;
  shelter_id: string;
  pet_id?: string;
  created_at: string;
  adopter?: { id: string; name: string };
  shelter?: { id: string; name: string };
  pet?: { id: string; name: string };
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

export interface MessageDto {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedMessages {
  data: MessageDto[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}