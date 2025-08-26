'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 OAuth 콜백 처리 시작...')
        console.log('📍 현재 URL:', window.location.href)
        
        // URL에서 쿼리 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        const code = urlParams.get('code')
        
        // 디버깅 정보 수집
        const debugData = {
          currentUrl: window.location.href,
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          error,
          errorDescription,
          hasCode: !!code,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          // 추가 디버깅 정보
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          urlHash: window.location.hash,
          urlPathname: window.location.pathname,
          // 모든 URL 파라미터
          allParams: Object.fromEntries(urlParams.entries())
        }
        
        setDebugInfo(JSON.stringify(debugData, null, 2))
        console.log('🔍 URL 파라미터:', debugData)
        
        // 에러가 있는 경우
        if (error) {
          console.error('❌ OAuth 에러:', error, errorDescription)
          setIsProcessing(false)
          
          // 서버 에러인 경우 더 자세한 정보 제공
          if (error === 'server_error') {
            console.error('🔍 서버 에러 상세:', errorDescription)
            
            const errorDetails = {
              error,
              errorDescription,
              debugInfo: debugData,
              possibleSolutions: [
                'Google OAuth 클라이언트 ID/시크릿 확인',
                'Supabase 프로젝트 설정 확인',
                '리디렉션 URI 설정 확인',
                '환경 변수 설정 확인',
                'PKCE 플로우 제거됨 - 기본 OAuth 플로우 사용'
              ]
            }
            
            router.push('/auth/login?error=server_error&details=' + encodeURIComponent(JSON.stringify(errorDetails)))
          } else if (error === 'access_denied') {
            const errorDetails = {
              error,
              errorDescription,
              debugInfo: debugData,
              possibleSolutions: [
                '사용자가 OAuth 인증을 취소함',
                'Google 계정 권한 확인',
                '다시 로그인 시도'
              ]
            }
            router.push('/auth/login?error=access_denied&details=' + encodeURIComponent(JSON.stringify(errorDetails)))
          } else {
            const errorDetails = {
              error,
              errorDescription,
              debugInfo: debugData,
              possibleSolutions: [
                '알 수 없는 OAuth 에러',
                '브라우저 캐시 삭제 후 재시도',
                '다른 브라우저에서 시도'
              ]
            }
            router.push(`/auth/login?error=${error}&details=` + encodeURIComponent(JSON.stringify(errorDetails)))
          }
          return
        }
        
        // 코드가 있는 경우 (Google OAuth에서 리디렉션된 경우)
        if (code) {
          console.log('🔑 OAuth 코드 발견, Supabase 인증 처리 중...')
          
          try {
            // PKCE 플로우 제거 후 더 간단한 방식으로 처리
            const { data, error: signInError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (signInError) {
              console.error('❌ 코드 교환 오류:', signInError)
              setDebugInfo(prev => prev + '\n\n코드 교환 오류: ' + JSON.stringify(signInError, null, 2))
              
              // 에러 상세 정보와 함께 로그인 페이지로
              router.push('/auth/login?error=code_exchange_failed&details=' + encodeURIComponent(signInError.message))
              return
            }
            
            console.log('✅ 코드 교환 성공:', data)
          } catch (exchangeError) {
            console.error('❌ 코드 교환 예외:', exchangeError)
            setDebugInfo(prev => prev + '\n\n코드 교환 예외: ' + JSON.stringify(exchangeError, null, 2))
          }
        }
        
        // 토큰이 있는 경우 세션 설정
        if (accessToken && refreshToken) {
          console.log('✅ 토큰 발견, 세션 설정 중...')
          
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (sessionError) {
            console.error('❌ 세션 설정 오류:', sessionError)
            setDebugInfo(prev => prev + '\n\n세션 설정 오류: ' + JSON.stringify(sessionError, null, 2))
            router.push('/auth/login?error=session_failed')
            return
          }
          
          console.log('✅ 세션 설정 완료:', session?.user?.email)
        }
        
        // 더 긴 대기 시간으로 세션 확인 (PKCE 제거 후 안정성 향상)
        console.log('⏳ 세션 설정 대기 중... (3초)')
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // 세션 확인
        const { data: { session }, error: sessionCheckError } = await supabase.auth.getSession()
        
        if (sessionCheckError) {
          console.error('❌ 세션 확인 오류:', sessionCheckError)
          setDebugInfo(prev => prev + '\n\n세션 확인 오류: ' + JSON.stringify(sessionCheckError, null, 2))
          router.push('/auth/login?error=auth_failed')
          return
        }

        console.log('📋 최종 세션 데이터:', session)

        if (session?.user) {
          console.log('✅ 사용자 인증 성공:', session.user.email)
          setIsProcessing(false)
          
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
          setDebugInfo(prev => prev + '\n\n세션 없음 - 인증 실패')
          setIsProcessing(false)
          router.push('/auth/login?error=no_session')
        }
      } catch (error) {
        console.error('❌ 콜백 처리 오류:', error)
        setDebugInfo(prev => prev + '\n\n콜백 처리 예외: ' + JSON.stringify(error, null, 2))
        setIsProcessing(false)
        router.push('/auth/login?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="text-center mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {isProcessing ? '인증 처리 중...' : '인증 처리 완료'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {isProcessing ? '잠시만 기다려주세요' : '리디렉션 중...'}
          </p>
        </div>
        
        {/* 디버깅 정보 표시 */}
        {debugInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔍 디버깅 정보 (PKCE 플로우 제거됨)
            </h3>
            <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto max-h-96">
              {debugInfo}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
