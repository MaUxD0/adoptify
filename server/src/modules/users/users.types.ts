export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'ADOPTER' | 'SHELTER'
  avatar_url?: string
  cover_url?: string
  phone?: string
  city?: string
  bio?: string
  shelter_id?: string
  created_at: string
}

export interface UpdateProfileBody {
  full_name?: string
  phone?: string
  city?: string
  bio?: string
  shelter_id?: string
  avatar_url?: string
  cover_url?: string
}
