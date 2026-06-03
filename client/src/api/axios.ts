import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { env } from '../config/env'
import { supabase } from './supabase'

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const axiosInstance = axios.create({
  baseURL: env.apiUrl,
})

axiosInstance.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.access_token) {
    const headers = new AxiosHeaders(config.headers ?? {})
    headers.set('Authorization', `Bearer ${session.access_token}`)
    config.headers = headers
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      const { data, error: refreshError } = await supabase.auth.refreshSession()

      if (!refreshError && data.session?.access_token) {
        const headers = new AxiosHeaders(originalRequest.headers ?? {})
        headers.set('Authorization', `Bearer ${data.session.access_token}`)
        originalRequest.headers = headers
        return axiosInstance(originalRequest)
      }

      await supabase.auth.signOut()
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

