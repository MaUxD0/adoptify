import { supabaseAdmin as supabase } from "../../config/supabase";

export const chatRepository = {
  async findConversationsByUser(userId: string) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        id,
        adopter_id,
        shelter_id,
        pet_id,
        created_at,
        adopter:users!chats_adopter_id_fkey(id, name),
        shelter:users!chats_shelter_id_fkey(id, name),
        pet:pets(id, name)
      `)
      .or(`adopter_id.eq.${userId},shelter_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findConversationById(conversationId: string) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        id,
        adopter_id,
        shelter_id,
        pet_id,
        created_at,
        adopter:users!chats_adopter_id_fkey(id, name),
        shelter:users!chats_shelter_id_fkey(id, name),
        pet:pets(id, name)
      `)
      .eq('id', conversationId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('chats')
      .select('id')
      .eq('id', conversationId)
      .or(`adopter_id.eq.${userId},shelter_id.eq.${userId}`)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  },

  async getMessages(conversationId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('chat_id', conversationId)
      .order('created_at', { ascending: true })
      .range(from, to);

    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
      hasMore: (from + limit) < (count ?? 0),
    };
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ chat_id: conversationId, sender_id: senderId, content })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markMessagesAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('chat_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },
};