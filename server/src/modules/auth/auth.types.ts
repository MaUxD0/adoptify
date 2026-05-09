export interface RegisterBody {
  email: string
  password: string
  full_name: string
  role: 'adopter' | 'shelter'
}

export interface LoginBody {
  email: string
  password: string
}