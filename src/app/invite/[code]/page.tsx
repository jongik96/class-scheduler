'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react';
import { acceptFriendInvite } from '@/lib/friends-api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

export default function InvitePage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const inviteCode = params.code as string;

  const handleInvite = useCallback(async () => {
    try {
      setStatus('loading');
      setMessage(t('invite.processing'));

      const success = await acceptFriendInvite(inviteCode);
      
      if (success) {
        setStatus('success');
        setMessage(t('invite.successMessage'));
        
        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
          router.push('/schedule/view?menu=friends');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(t('invite.errorMessage'));
      }
    } catch {
      setStatus('error');
      setMessage(t('invite.generalError'));
    }
  }, [inviteCode, router, t]);

  useEffect(() => {
    if (!user) {
      setStatus('error');
      setMessage(t('invite.loginRequired'));
      return;
    }

    handleInvite();
  }, [user, inviteCode, handleInvite, t]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('invite.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('invite.inviteCode')}: {inviteCode}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-4">
            {getStatusIcon()}
            
            <div className="space-y-2">
              <h3 className={`text-lg font-medium ${getStatusColor()}`}>
                {status === 'loading' && t('invite.processing')}
                {status === 'success' && t('invite.success')}
                {status === 'error' && t('invite.error')}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            </div>

            {status === 'error' && (
              <div className="pt-4">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('invite.loginButton')}
                </button>
              </div>
            )}

            {status === 'success' && (
              <div className="pt-4">
                <button
                  onClick={() => router.push('/schedule/view?menu=friends')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {t('invite.viewFriends')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
