import { createContext } from 'react'
import type { User, LoginFormData, RegisterFormData } from '../types/auth.types'

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
