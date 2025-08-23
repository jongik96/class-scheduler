'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 OAuth 콜백 처리 시작...')
        
        // URL에서 해시 파라미터 확인
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        console.log('🔑 토큰 확인:', { accessToken: !!accessToken, refreshToken: !!refreshToken })
        
        if (accessToken && refreshToken) {
          console.log('✅ 토큰 발견, 세션 설정 중...')
          
          // 세션 설정
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (sessionError) {
            console.error('❌ 세션 설정 오류:', sessionError)
            router.push('/auth/login?error=session_failed')
            return
          }
          
          console.log('✅ 세션 설정 완료:', session?.user?.email)
        }
        
        // 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ 세션 확인 오류:', error)
          router.push('/auth/login?error=auth_failed')
          return
        }

        console.log('📋 최종 세션 데이터:', session)

        if (session?.user) {
          console.log('✅ 사용자 인증 성공:', session.user.email)
          
          // 프로필 완성 상태 확인
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_profile_complete')
              .eq('id', session.user.id)
              .single()

            if (profile?.is_profile_complete) {
              console.log('✅ 프로필 완성, View Schedule Page로 이동')
              router.push('/schedule/view')
            } else {
              console.log('⚠️ 프로필 미완성, 프로필 완성 페이지로 이동')
              router.push('/auth/complete-profile')
            }
          } catch {
            // 프로필이 없는 경우 (새 사용자) 프로필 완성 페이지로
            console.log('🆕 새 사용자, 프로필 완성 페이지로 이동')
            router.push('/auth/complete-profile')
          }
        } else {
          console.log('❌ 세션 없음, 로그인 페이지로 이동')
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('❌ 콜백 처리 오류:', error)
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
