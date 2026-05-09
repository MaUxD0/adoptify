import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Cliente con service_role para operaciones del servidor (bypassea RLS)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)