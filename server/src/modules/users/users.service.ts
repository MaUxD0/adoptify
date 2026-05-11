import { supabaseAdmin } from '../../config/supabase'
import type { UpdateProfileBody, UserProfile } from './users.types'

export const usersService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (error || !user) throw new Error('Usuario no encontrado')

    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? '',
      role: user.user_metadata?.role ?? 'adopter',
      avatar_url: user.user_metadata?.avatar_url,
      phone: user.user_metadata?.phone,
      city: user.user_metadata?.city,
      bio: user.user_metadata?.bio,
      created_at: user.created_at,
    }
  },

  async updateProfile(userId: string, updates: UpdateProfileBody): Promise<UserProfile> {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: updates,
    })
    if (error || !user) throw new Error('Error al actualizar perfil')

    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? '',
      role: user.user_metadata?.role ?? 'adopter',
      avatar_url: user.user_metadata?.avatar_url,
      phone: user.user_metadata?.phone,
      city: user.user_metadata?.city,
      bio: user.user_metadata?.bio,
      created_at: user.created_at,
    }
  },
}