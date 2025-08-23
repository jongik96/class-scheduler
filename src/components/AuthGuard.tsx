'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // 로딩 중이면 대기

    if (requireAuth && !user) {
      // 인증이 필요한 페이지인데 로그인하지 않은 경우
      console.log('🚫 인증 필요: 로그인 페이지로 리다이렉트')
      router.push(redirectTo)
    } else if (!requireAuth && user) {
      // 인증이 필요 없는 페이지(메인, 로그인)인데 로그인한 경우
      console.log('✅ 이미 로그인됨: 스케줄 페이지로 리다이렉트')
      router.push('/schedule/view')
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // 로딩 중이거나 리다이렉트 중인 경우
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">인증 확인 중...</p>
          </div>
        </div>
      </div>
    )
  }

  // 인증 상태에 따른 렌더링
  if (requireAuth && !user) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  if (!requireAuth && user) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  return <>{children}</>
}
