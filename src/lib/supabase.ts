import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Usar el proxy local en desarrollo para evitar bloqueos por CORS en la API remota
const isDev = import.meta.env.DEV
const supabaseUrl = isDev && typeof window !== 'undefined'
  ? `${window.location.origin}/supabase-proxy`
  : rawUrl

if (!rawUrl || !supabaseAnonKey || rawUrl.includes('tu-proyecto')) {
  console.warn(
    '[Supabase] Las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configuradas en .env'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
