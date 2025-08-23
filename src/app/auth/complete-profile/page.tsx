'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, GraduationCap, Hash, UserCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function CompleteProfilePage() {
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
      console.error('프로필 상태 확인 오류:', error);
    }
  }, [user, router]);

  useEffect(() => {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // 이미 프로필이 완성된 사용자는 메인 페이지로 리다이렉트
    checkProfileStatus();
  }, [user, router, checkProfileStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // 프로필 정보 저장
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

      // 메인 페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.');
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
            프로필 완성하기
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            추가 정보를 입력하여 프로필을 완성해주세요
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                학번
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
                  placeholder="예: 20240001"
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            {/* Major */}
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                전공/학과
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
                  placeholder="예: 컴퓨터공학과"
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            {/* Grade */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                학년
              </label>
              <select
                id="grade"
                name="grade"
                required
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value={1}>1학년</option>
                <option value={2}>2학년</option>
                <option value={3}>3학년</option>
                <option value={4}>4학년</option>
                <option value={5}>5학년</option>
                <option value={6}>6학년</option>
              </select>
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                닉네임
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
                  placeholder="예: 코딩마스터"
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
                  '프로필 완성하기'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
