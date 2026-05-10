import axios from 'axios'
import { supabase } from '../api/supabase'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Inyecta token automáticamente desde Supabase
axiosInstance.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${session.access_token}`,
    }
  }

  return config
})

// Manejo global de errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance