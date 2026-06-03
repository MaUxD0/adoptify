import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ?? '5000',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev_secret',
}

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const

for (const key of required) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

