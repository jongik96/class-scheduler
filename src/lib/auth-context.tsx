'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type AuthUser } from './supabase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  profileComplete: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        })
        // 프로필 완성 상태 확인
        await checkProfileStatus(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata
          })
          // 프로필 완성 상태 확인
          await checkProfileStatus(session.user.id)
        } else {
          setUser(null)
          setProfileComplete(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkProfileStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_profile_complete')
        .eq('id', userId)
        .single()

      setProfileComplete(profile?.is_profile_complete || false)
    } catch (error) {
      console.error('프로필 상태 확인 오류:', error)
      setProfileComplete(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Google 로그인 오류:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfileComplete(false)
    } catch (error) {
      console.error('로그아웃 오류:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    profileComplete,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
