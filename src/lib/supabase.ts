import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 인증 타입 정의
export type AuthUser = {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
    provider?: string
  }
}

export type AuthError = {
  message: string
}
