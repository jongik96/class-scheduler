'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, GraduationCap, Hash, UserCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';

export default function CompleteProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    major: '',
    grade: 1,
    nickname: ''
  });

  const checkProfileStatus = useCallback(async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_profile_complete')
        .eq('id', user.id)
        .single();

      if (profile?.is_profile_complete) {
        router.push('/');
      }
    } catch (error) {
      console.error('Profile status check error:', error);
    }
  }, [user, router]);

  useEffect(() => {
    // Redirect unauthenticated users to login page
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Redirect users with completed profiles to main page
    checkProfileStatus();
  }, [user, router, checkProfileStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Save profile information
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
          student_id: formData.studentId,
          major: formData.major,
          grade: formData.grade,
          nickname: formData.nickname,
          is_profile_complete: true
        });

      if (error) throw error;

              // Redirect to main page
        router.push('/');
      } catch (error) {
        console.error('Profile save error:', error);
        alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20">
            <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t('profile.complete.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('profile.complete.subtitle')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.complete.studentId')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  placeholder={t('profile.complete.studentIdPlaceholder')}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            {/* Major */}
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.complete.major')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="major"
                  name="major"
                  type="text"
                  required
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  placeholder={t('profile.complete.majorPlaceholder')}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            {/* Grade */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.complete.grade')}
              </label>
              <select
                id="grade"
                name="grade"
                required
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value={1}>{t('profile.complete.grade1')}</option>
                <option value={2}>{t('profile.complete.grade2')}</option>
                <option value={3}>{t('profile.complete.grade3')}</option>
                <option value={4}>{t('profile.complete.grade4')}</option>
                <option value={5}>{t('profile.complete.grade5')}</option>
                <option value={6}>{t('profile.complete.grade6')}</option>
              </select>
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.complete.nickname')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder={t('profile.complete.nicknamePlaceholder')}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  t('profile.complete.completeButton')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
