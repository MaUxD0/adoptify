import { createContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../api/supabase'
import { authService } from '../services/auth.service'
import type { User, LoginFormData, RegisterFormData } from '../types/auth.types'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Escuchar cambios de sesión de Supabase
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        localStorage.setItem('token', session.access_token)
      } else {
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (data: LoginFormData) => {
    setError(null)
    setLoading(true)
    try {
      await authService.login(data)
      // onAuthStateChange se encarga de setear el user
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterFormData) => {
    setError(null)
    setLoading(true)
    try {
      await authService.register(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}