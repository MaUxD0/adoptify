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
    return data ?? [];
  },

  async findConversationById(id: string) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        id,
        adopter_id,
        shelter_id,
        pet_id,
        created_at
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async isParticipant(chatId: string, userId: string) {
    const { data, error } = await supabase
      .from('chats')
      .select('id')
      .eq('id', chatId)
      .or(`adopter_id.eq.${userId},shelter_id.eq.${userId}`)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getMessages(chatId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('chat_id', chatId)
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

  async sendMessage(chatId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markMessagesAsRead(chatId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },
  
  async findOrCreateConversation(adopterId: string, shelterId: string, petId?: string) {
  const { data: existing } = await supabase
    .from('chats')
    .select('*')
    .eq('adopter_id', adopterId)
    .eq('shelter_id', shelterId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('chats')
    .insert({ 
      adopter_id: adopterId, 
      shelter_id: shelterId,
      pet_id: petId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
},

};