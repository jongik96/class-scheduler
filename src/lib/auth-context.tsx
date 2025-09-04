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
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        }
        
        if (session) {
          setUser(session.user)
          setLoading(false)
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch {
        setUser(null)
        setLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])


  const signInWithGoogle = async () => {
    try {
      const isProduction = process.env.NODE_ENV === 'production'
      const redirectTo = isProduction 
        ? `${window.location.origin}/auth/callback`
        : `${window.location.origin}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
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
