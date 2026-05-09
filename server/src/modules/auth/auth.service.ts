import { supabaseAdmin } from '../../config/supabase'
import type { RegisterBody, LoginBody } from './auth.types'

export const authService = {
  async register({ email, password, full_name, role }: RegisterBody) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name, role },
      email_confirm: true,
    })
    if (error) throw error
    return data.user
  },

  async getUserById(id: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id)
    if (error) throw error
    return data.user
  },

  async verifyToken(token: string) {
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error) throw error
    return data.user
  },
}