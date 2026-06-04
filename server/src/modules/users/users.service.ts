import { supabaseAdmin } from '../../config/supabase'
import type { UpdateProfileBody, UserProfile } from './users.types'

const mapProfile = (user: NonNullable<Awaited<ReturnType<typeof supabaseAdmin.auth.admin.getUserById>>['data']['user']>): UserProfile => {
  const metadata = user.user_metadata ?? {}
  const role = String(metadata.role ?? 'ADOPTER').toUpperCase() as UserProfile['role']

  return {
    id: user.id,
    email: user.email!,
    full_name: metadata.full_name ?? '',
    role,
    avatar_url: metadata.avatar_url,
    cover_url: metadata.cover_url,
    phone: metadata.phone,
    city: metadata.city,
    bio: metadata.bio,
    shelter_id: metadata.shelter_id ?? (role === 'SHELTER' ? user.id : undefined),
    created_at: user.created_at,
  }
}

export const usersService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (error || !user) throw new Error('Usuario no encontrado')
    return mapProfile(user)
  },

  async updateProfile(userId: string, updates: UpdateProfileBody): Promise<UserProfile> {
    const { data: current, error: currentError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (currentError || !current.user) throw new Error('Usuario no encontrado')

    const { data: { user }, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...(current.user.user_metadata ?? {}),
        ...updates,
      },
    })
    if (error || !user) throw new Error('Error al actualizar perfil')
    return mapProfile(user)
  },
}
