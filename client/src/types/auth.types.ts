export type UserRole = 'adopter' | 'shelter'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  shelter_id?: string
  avatar_url?: string
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  full_name: string
  role: UserRole
}