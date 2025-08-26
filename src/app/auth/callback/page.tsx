'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 OAuth callback processing started...')
        console.log('📍 Current URL:', window.location.href)
        
        // URL에서 쿼리 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        const code = urlParams.get('code')
        
        // 에러가 있는 경우
        if (error) {
          console.error('❌ OAuth error:', error, errorDescription)
          setIsProcessing(false)
          
          // 서버 에러인 경우 더 자세한 정보 제공
          if (error === 'server_error') {
            console.error('🔍 Server error details:', errorDescription)
            
            const errorDetails = {
              error,
              errorDescription,
              possibleSolutions: [
                'Check Google OAuth client ID/secret',
                'Verify Supabase project settings',
                'Check redirect URI configuration',
                'Verify environment variables',
                'PKCE flow removed - using basic OAuth flow'
              ]
            }
            
            router.push('/auth/login?error=server_error&details=' + encodeURIComponent(JSON.stringify(errorDetails)))
          } else if (error === 'access_denied') {
            const errorDetails = {
              error,
              errorDescription,
              possibleSolutions: [
                'User cancelled OAuth authentication',
                'Check Google account permissions',
                'Try logging in again'
              ]
            }
            router.push('/auth/login?error=access_denied&details=' + encodeURIComponent(JSON.stringify(errorDetails)))
          } else {
            const errorDetails = {
              error,
              errorDescription,
              possibleSolutions: [
                'Unknown OAuth error',
                'Clear browser cache and retry',
                'Try with different browser'
              ]
            }
            router.push(`/auth/login?error=${error}&details=` + encodeURIComponent(JSON.stringify(errorDetails)))
          }
          return
        }
        
        // 코드가 있는 경우 (Google OAuth에서 리디렉션된 경우)
        if (code) {
          console.log('🔑 OAuth code found, processing Supabase authentication...')
          
          try {
            // PKCE 플로우 제거 후 더 간단한 방식으로 처리
            const { data, error: signInError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (signInError) {
              console.error('❌ Code exchange error:', signInError)
              
              // 에러 상세 정보와 함께 로그인 페이지로
              router.push('/auth/login?error=code_exchange_failed&details=' + encodeURIComponent(signInError.message))
              return
            }
            
            console.log('✅ Code exchange successful:', data)
          } catch (exchangeError) {
            console.error('❌ Code exchange exception:', exchangeError)
          }
        }
        
        // 토큰이 있는 경우 세션 설정
        if (accessToken && refreshToken) {
          console.log('✅ Token found, setting session...')
          
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (sessionError) {
            console.error('❌ Session setting error:', sessionError)
            router.push('/auth/login?error=session_failed')
            return
          }
          
          console.log('✅ Session set successfully:', session?.user?.email)
        }
        
        // 더 긴 대기 시간으로 세션 확인 (PKCE 제거 후 안정성 향상)
        console.log('⏳ Waiting for session to be confirmed... (3 seconds)')
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // 세션 확인
        const { data: { session }, error: sessionCheckError } = await supabase.auth.getSession()
        
        if (sessionCheckError) {
          console.error('❌ Session check error:', sessionCheckError)
          router.push('/auth/login?error=auth_failed')
          return
        }

        console.log('📋 Final session data:', session)

        if (session?.user) {
          console.log('✅ User authentication successful:', session.user.email)
          setIsProcessing(false)
          
          // 프로필 완성 상태 확인
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_profile_complete')
              .eq('id', session.user.id)
              .single()

            if (profile?.is_profile_complete) {
              console.log('✅ Profile complete, navigating to View Schedule Page')
              router.push('/schedule/view')
            } else {
              console.log('⚠️ Profile incomplete, navigating to complete profile page')
              router.push('/auth/complete-profile')
            }
          } catch {
            // 프로필이 없는 경우 (새 사용자) 프로필 완성 페이지로
            console.log('🆕 New user, navigating to complete profile page')
            router.push('/auth/complete-profile')
          }
        } else {
          console.log('❌ No session, navigating to login page')
          setIsProcessing(false)
          router.push('/auth/login?error=no_session')
        }
      } catch (error) {
        console.error('❌ Callback processing error:', error)
        setIsProcessing(false)
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
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {isProcessing ? '인증 처리 중...' : '인증 처리 완료'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {isProcessing ? '잠시만 기다려주세요' : '리디렉션 중...'}
          </p>
        </div>
      </div>
    </div>
  )
}
