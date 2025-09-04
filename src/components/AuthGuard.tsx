'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { RefreshCw, AlertCircle } from 'lucide-react'

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
  const { t } = useLanguage()
  const router = useRouter()
  const [isTimeout, setIsTimeout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // 데모 모드 확인
  useEffect(() => {
    const checkDemoMode = () => {
      const demoMode = localStorage.getItem('demoMode') === 'true'
      setIsDemoMode(demoMode)
    }
    
    checkDemoMode()
    
    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkDemoMode()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // 3초 타임아웃 설정
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setIsTimeout(true)
        setError(t('auth.timeoutError'))
      }, 3000)

      return () => clearTimeout(timeout)
    } else {
      setIsTimeout(false)
      setError(null)
    }
  }, [loading, t])

  useEffect(() => {
    if (loading) return // 로딩 중이면 대기

    // 데모 모드인 경우 인증 요구하지 않음
    if (isDemoMode) {
      console.log('🎮 데모 모드: 인증 없이 접근 허용')
      return
    }

    if (requireAuth && !user) {
      // 인증이 필요한 페이지인데 로그인하지 않은 경우
      console.log('🚫 인증 필요: 로그인 페이지로 리다이렉트')
      router.push(redirectTo)
    } else if (!requireAuth && user) {
      // 인증이 필요 없는 페이지(메인, 로그인)인데 로그인한 경우
      console.log('✅ 이미 로그인됨: 스케줄 페이지로 리다이렉트')
      router.push('/schedule/view')
    }
  }, [user, loading, requireAuth, redirectTo, router, isDemoMode])

  const handleRetry = () => {
    setIsTimeout(false)
    setError(null)
    // 페이지 새로고침으로 재시도
    window.location.reload()
  }

  // 로딩 중이거나 리다이렉트 중인 경우 (데모 모드가 아닌 경우에만)
  if (loading && !isDemoMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            {isTimeout ? (
              <div className="space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('auth.timeoutTitle')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {error}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('common.retry')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">{t('auth.verifying')}</p>
              </div>
            )}
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
