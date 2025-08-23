'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 오류:', error)
          router.push('/auth/login?error=auth_failed')
          return
        }

        if (session?.user) {
          // 프로필 완성 상태 확인
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_profile_complete')
              .eq('id', session.user.id)
              .single()

            if (profile?.is_profile_complete) {
              // 프로필이 완성된 경우 메인 페이지로
              router.push('/')
            } else {
              // 프로필이 미완성인 경우 프로필 완성 페이지로
              router.push('/auth/complete-profile')
            }
          } catch (profileError) {
            // 프로필이 없는 경우 (새 사용자) 프로필 완성 페이지로
            console.log('새 사용자입니다. 프로필 완성 페이지로 이동합니다.')
            router.push('/auth/complete-profile')
          }
        } else {
          // 세션이 없으면 로그인 페이지로 리다이렉트
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('콜백 처리 오류:', error)
        router.push('/auth/login?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">인증 처리 중...</p>
        </div>
      </div>
    </div>
  )
}
