export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'adopter' | 'shelter'
  avatar_url?: string
  phone?: string
  city?: string
  bio?: string
  created_at: string
}

export interface UpdateProfileBody {
  full_name?: string
  phone?: string
  city?: string
  bio?: string
}