import { supabase } from '../api/supabase'
import type { LoginFormData, RegisterFormData, User } from '../types/auth.types'

export const authService = {
  async login({ email, password }: LoginFormData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async register({ email, password, full_name, role }: RegisterFormData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, role },
      },
    })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    return {
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata?.full_name ?? '',
      role: user.user_metadata?.role ?? 'adopter',
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at,
    }
  },
}