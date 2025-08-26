'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Users, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { getFriends, shareAssignment, Friend } from '@/lib/friends-api';
import { assignmentsApi, coursesApi, type Course } from '@/lib/api';

export default function AddAssignmentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadFriends();
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const coursesList = await coursesApi.getCourses();
      setCourses(coursesList);
    } catch (error) {
      console.error('Courses list load error:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const friendsList = await getFriends();
      setFriends(friendsList);
    } catch (error) {
      console.error('Friends list load error:', error);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Supabase에 과제 추가
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        course_id: formData.course_id, // course를 course_id로 변경
        due_date: formData.dueDate,
        priority: formData.priority as 'low' | 'medium' | 'high',
        status: formData.status as 'pending' | 'in_progress' | 'completed',
        is_shared: selectedFriends.length > 0
      };

      const newAssignment = await assignmentsApi.createAssignment(assignmentData);
      console.log('✅ 과제 추가 성공:', newAssignment);
      
      // 친구들과 공유
      if (selectedFriends.length > 0 && newAssignment) {
        const success = await shareAssignment(newAssignment.id, selectedFriends, 'view');
        
        if (success) {
          console.log('과제를 친구들과 공유했습니다');
        } else {
          console.error('친구들과 과제 공유 실패');
        }
      }
      
      // 성공 상태 표시
      setIsSuccess(true);
      
      // 2초 후 과제 목록 화면으로 리디렉션
      setTimeout(() => {
        router.push('/assignment/list');
      }, 2000);
      
    } catch (error) {
      console.error('❌ 과제 추가 실패:', error);
      alert(`과제 추가에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/assignment/list"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('assignments.add.backToList')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('assignments.add.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('assignments.add.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('assignments.add.assignmentTitle')}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('assignments.add.assignmentTitlePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('assignments.add.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('assignments.add.descriptionPlaceholder')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('assignments.add.course')}
                  </label>
                  <select
                    value={formData.course_id}
                    onChange={(e) => handleInputChange('course_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">{t('common.selectCourse')}</option>
                    {isLoadingCourses ? (
                      <option value="">{t('common.loadingCourses')}</option>
                    ) : courses.length === 0 ? (
                      <option value="">{t('common.noCoursesAvailable')}</option>
                    ) : (
                      courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.course_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('assignments.add.dueDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('assignments.add.priority')}
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">{t('priority.low')}</option>
                    <option value="medium">{t('priority.medium')}</option>
                    <option value="high">{t('priority.high')}</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div>
                  {isSuccess ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          {t('common.assignmentAddedSuccess')}
                        </span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {t('common.redirectingToAssignmentList')}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#BAE1FF] hover:bg-[#87CEEB] disabled:bg-[#E0F2FE] text-gray-800 font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('assignments.add.creating')}
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          {t('assignments.add.create')}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Share with Friends */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {t('assignments.add.shareWithFriends')}
              </h3>
              
              {isLoadingFriends ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('assignments.add.loadingFriends')}</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">{t('assignments.add.noFriends')}</p>
                  <Link
                    href="/schedule/view?menu=friends"
                    className="text-blue-600 hover:text-blue-500 text-sm"
                  >
                    {t('assignments.add.addFirstFriend')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('assignments.add.selectFriends')}
                  </p>
                  
                  {friends.map((friend) => (
                    <label key={friend.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFriends.includes(friend.friend_id)}
                        onChange={() => handleFriendToggle(friend.friend_id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {friend.friend_profile?.nickname || t('common.unknown')}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {friend.friend_profile?.full_name} • {friend.friend_profile?.major}
                        </p>
                      </div>
                    </label>
                  ))}
                  
                  {selectedFriends.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {t('assignments.add.sharingWithFriends', { count: selectedFriends.length })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
