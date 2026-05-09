import axiosInstance from '../api/axios'
import type { User } from '../types/auth.types'

export interface UpdateProfileData {
  full_name?: string
  phone?: string
  city?: string
  bio?: string
}

export const usersService = {
  async getMyProfile(): Promise<User> {
    const { data } = await axiosInstance.get('/users/profile')
    return data.profile
  },

  async updateMyProfile(updates: UpdateProfileData): Promise<User> {
    const { data } = await axiosInstance.patch('/users/profile', updates)
    return data.profile
  },
}