export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
}

const missing = [
  !env.apiUrl && 'VITE_API_URL',
  !env.supabaseUrl && 'VITE_SUPABASE_URL',
  !env.supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
].filter(Boolean)

if (missing.length > 0) {
  throw new Error(
    `Faltan variables en client/.env: ${missing.join(', ')}. Reinicia npm run dev después de guardar.`,
  )
}
