'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';

function LoginContent() {
  const { t } = useLanguage();
  const { signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 에러 정보 읽기
  useEffect(() => {
    const urlError = searchParams.get('error');
    const details = searchParams.get('details');
    
    if (urlError) {
      let errorMessage = '';
      let errorDetails = '';
      
      try {
        if (details) {
          const parsedDetails = JSON.parse(decodeURIComponent(details));
          errorDetails = JSON.stringify(parsedDetails, null, 2);
        }
      } catch {
        errorDetails = details || '';
      }
      
      switch (urlError) {
        case 'server_error':
          errorMessage = '서버 오류가 발생했습니다. Google Cloud Console 설정을 확인해주세요.';
          break;
        case 'access_denied':
          errorMessage = '접근이 거부되었습니다. 권한을 확인해주세요.';
          break;
        case 'invalid_request':
          errorMessage = '잘못된 요청입니다. 설정을 확인해주세요.';
          break;
        case 'code_exchange_failed':
          errorMessage = 'OAuth 코드 교환에 실패했습니다. Supabase 설정을 확인해주세요.';
          break;
        case 'session_failed':
          errorMessage = '세션 설정에 실패했습니다. 다시 시도해주세요.';
          break;
        case 'auth_failed':
          errorMessage = '인증에 실패했습니다. 다시 시도해주세요.';
          break;
        case 'no_session':
          errorMessage = '세션이 생성되지 않았습니다. 다시 시도해주세요.';
          break;
        case 'callback_failed':
          errorMessage = '콜백 처리에 실패했습니다. 다시 시도해주세요.';
          break;
        default:
          errorMessage = `인증 오류: ${urlError}`;
      }
      
      setError(errorMessage + (errorDetails ? `\n\n상세 정보:\n${errorDetails}` : ''));
    }
  }, [searchParams]);

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('auth.login.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              구글 계정으로 로그인하여 서비스를 이용하세요
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300 flex-shrink-0" />
                    <div className="ml-3 w-full">
                      <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">{error}</p>
                      
                      {/* 서버 에러인 경우 해결 방법 표시 */}
                      {error.includes('server_error') && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-800/30 rounded-md">
                          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">
                            🔧 해결 방법:
                          </p>
                          <ol className="list-decimal list-inside text-xs text-red-600 dark:text-red-400 space-y-1">
                            <li>Google Cloud Console에서 승인된 리디렉션 URI 확인</li>
                            <li>Supabase OAuth 설정 재확인</li>
                            <li>환경 변수 설정 확인</li>
                            <li>몇 분 후 다시 시도</li>
                          </ol>
                        </div>
                      )}
                      
                      {/* OAuth 코드 교환 실패인 경우 */}
                      {error.includes('code_exchange_failed') && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-800/30 rounded-md">
                          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">
                            🔧 해결 방법:
                          </p>
                          <ol className="list-decimal list-inside text-xs text-red-600 dark:text-red-400 space-y-1">
                            <li>Supabase 프로젝트 URL과 API 키 확인</li>
                            <li>Google OAuth 클라이언트 ID/시크릿 확인</li>
                            <li>리디렉션 URI가 정확한지 확인</li>
                            <li>Supabase Auth 설정 재확인</li>
                          </ol>
                        </div>
                      )}
                      
                      {/* 일반적인 인증 실패인 경우 */}
                      {(error.includes('session_failed') || error.includes('auth_failed') || error.includes('no_session')) && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-800/30 rounded-md">
                          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">
                            🔧 해결 방법:
                          </p>
                          <ol className="list-decimal list-inside text-xs text-red-600 dark:text-red-400 space-y-1">
                            <li>브라우저 캐시 및 쿠키 삭제</li>
                            <li>다른 브라우저에서 시도</li>
                            <li>인터넷 연결 상태 확인</li>
                            <li>잠시 후 다시 시도</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Google Login */}
              <div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setError(null);
                      await signInWithGoogle();
                    } catch {
                      setError(t('auth.login.googleLoginError'));
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isLoading ? t('auth.login.loggingIn') : t('auth.login.googleLogin')}
                </button>
              </div>

              {/* Info Text */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  구글 계정으로 간편하게 로그인하고 서비스를 이용하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
