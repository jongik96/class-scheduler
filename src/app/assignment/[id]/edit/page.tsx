'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { assignmentsApi, coursesApi, type Course, type Assignment } from '@/lib/api';

export default function EditAssignmentPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAssignment, setIsLoadingAssignment] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기존 과제 데이터 로드
  useEffect(() => {
    if (assignmentId && user) {
      loadAssignment();
      loadCourses();
    }
  }, [assignmentId, user]);

  const loadAssignment = async () => {
    try {
      setIsLoadingAssignment(true);
      const assignment = await assignmentsApi.getAssignment(assignmentId);
      
      if (assignment) {
        setFormData({
          title: assignment.title,
          description: assignment.description || '',
          course_id: assignment.course_id || '',
          dueDate: assignment.due_date.split('T')[0], // YYYY-MM-DD 형식으로 변환
          priority: assignment.priority,
          status: assignment.status
        });
      }
    } catch (err) {
      console.error('❌ 과제 데이터 로드 실패:', err);
      setError('과제 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingAssignment(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        course_id: formData.course_id,
        due_date: formData.dueDate,
        priority: formData.priority as 'low' | 'medium' | 'high',
        status: formData.status as 'pending' | 'in_progress' | 'completed'
      };

      await assignmentsApi.updateAssignment(assignmentId, assignmentData);
      console.log('✅ 과제 수정 성공');
      
      setIsSuccess(true);
      
      // 2초 후 과제 목록 화면으로 리디렉션
      setTimeout(() => {
        router.push('/assignment/list');
      }, 2000);
      
    } catch (error) {
      console.error('❌ 과제 수정 실패:', error);
      alert(`과제 수정에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoadingAssignment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('common.loadingData')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link
              href="/assignment/list"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.backToAssignmentList')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            과제 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('common.editAssignmentTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('common.editAssignmentSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
                  >
                    <option value="">{t('common.selectCoursePlaceholder')}</option>
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

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    상태
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="pending">{t('common.pending')}</option>
                    <option value="in_progress">{t('common.inProgress')}</option>
                    <option value="completed">{t('common.completed')}</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div>
                  {isSuccess ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          {t('common.assignmentUpdatedSuccess')}
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          수정 중...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          과제 수정
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                미리보기
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded border border-gray-200 dark:border-gray-600">
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {formData.title || '과제 제목'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.description || '과제 설명'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    마감일: {formData.dueDate || '날짜 미설정'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    우선순위: {formData.priority === 'high' ? '높음' : formData.priority === 'medium' ? '보통' : '낮음'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
