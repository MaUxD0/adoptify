import { supabaseAdmin } from '../../config/supabase'
import type { UpdateProfileBody, UploadProfileImageBody, UserProfile } from './users.types'

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

const ensureProfileImagesBucket = async () => {
  const { data: bucket, error } = await supabaseAdmin.storage.getBucket('avatars')

  if (!bucket && error) {
    const { error: createError } = await supabaseAdmin.storage.createBucket('avatars', {
      public: true,
    })
    if (createError) throw new Error(`Error al preparar bucket: ${createError.message}`)
    return
  }

  if (bucket && !bucket.public) {
    const { error: updateError } = await supabaseAdmin.storage.updateBucket('avatars', {
      public: true,
    })
    if (updateError) throw new Error(`Error al publicar bucket: ${updateError.message}`)
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

  async uploadProfileImage(userId: string, payload: UploadProfileImageBody): Promise<UserProfile> {
    const match = payload.dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) throw new Error('Imagen invalida')

    const contentType = match[1]
    const base64 = match[2]
    const ext = payload.fileName.split('.').pop()?.toLowerCase() ?? contentType.split('/')[1] ?? 'jpg'
    const folder = payload.type === 'avatar' ? 'avatars' : 'covers'
    const metadataKey = payload.type === 'avatar' ? 'avatar_url' : 'cover_url'
    const path = `${folder}/${userId}-${Date.now()}.${ext}`
    const buffer = Buffer.from(base64, 'base64')

    await ensureProfileImagesBucket()

    const { error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(path, buffer, {
        contentType,
        upsert: true,
      })

    if (error) throw new Error(`Error al subir imagen: ${error.message}`)

    const { data } = supabaseAdmin.storage.from('avatars').getPublicUrl(path)
    return this.updateProfile(userId, { [metadataKey]: data.publicUrl })
  },
}
