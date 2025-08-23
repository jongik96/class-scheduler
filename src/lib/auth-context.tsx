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
      console.log('🔍 현재 세션 확인 중...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ 세션 확인 오류:', error)
      }
      
      console.log('📋 세션 데이터:', session)
      
      if (session?.user) {
        console.log('✅ 사용자 세션 발견:', session.user)
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        })
        // 프로필 완성 상태 확인
        await checkProfileStatus(session.user.id)
      } else {
        console.log('❌ 사용자 세션 없음')
      }
      setLoading(false)
    }

    getSession()

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 인증 상태 변경:', event, session?.user?.email)
        
        if (session?.user) {
          console.log('✅ 로그인 상태 감지:', session.user)
          setUser({
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata
          })
          // 프로필 완성 상태 확인
          await checkProfileStatus(session.user.id)
        } else {
          console.log('❌ 로그아웃 상태 감지')
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
      console.log('🚀 Google 로그인 시작...')
      
      // 현재 환경에 따른 리다이렉트 URL 설정
      const isProduction = window.location.hostname !== 'localhost'
      const redirectTo = isProduction 
        ? 'https://class-scheduler-nine.vercel.app/auth/callback'
        : `${window.location.origin}/auth/callback`
      
      console.log('🌐 환경:', isProduction ? 'Production' : 'Development')
      console.log('🔄 콜백 URL:', redirectTo)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      
      if (error) {
        console.error('❌ Google 로그인 오류:', error)
        throw error
      }
      
      console.log('✅ Google 로그인 리다이렉트 성공:', data)
      console.log('🔄 리다이렉트 URL:', data.url)
    } catch (error) {
      console.error('❌ Google 로그인 예외:', error)
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
