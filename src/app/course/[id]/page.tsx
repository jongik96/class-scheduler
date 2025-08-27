'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Clock, MapPin, User, BookOpen, Calendar, CheckSquare, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';
import { coursesApi, assignmentsApi, type Course, type Assignment } from '@/lib/api';
import { migrateToPastelColor } from '@/lib/constants';

export default function CourseDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 수업 데이터 로드
  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 수업 정보 로드
      const courseData = await coursesApi.getCourse(courseId);
      setCourse(courseData);
      
      // 모든 과제를 로드하고 해당 수업의 과제만 필터링
      const allAssignments = await assignmentsApi.getAssignments();
      const courseAssignments = allAssignments.filter(assignment => 
        assignment.course_id === courseId
      );
      setAssignments(courseAssignments);
      
    } catch (err) {
      console.error('수업 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '수업 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 수업 삭제 핸들러
  const handleDeleteCourse = async () => {
    if (!course) return;
    
    if (confirm('정말로 이 수업을 삭제하시겠습니까?')) {
      try {
        await coursesApi.deleteCourse(course.id);
        router.push('/schedule/view');
      } catch (err) {
        console.error('수업 삭제 실패:', err);
        alert('수업 삭제에 실패했습니다.');
      }
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return t('priority.high');
      case 'medium':
        return t('priority.medium');
      case 'low':
        return t('priority.low');
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return t('dueDate.overdue', { days: Math.abs(diffDays) });
    } else if (diffDays === 0) {
      return t('dueDate.today');
    } else if (diffDays === 1) {
      return t('dueDate.tomorrow');
    } else {
      return t('dueDate.daysLeft', { days: diffDays });
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">수업 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || '수업을 찾을 수 없습니다.'}
            </p>
            <button
              onClick={loadCourseData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
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
            href="/schedule/view"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('course.detail.backToSchedule')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {course.course_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {course.course_code} • {course.professor}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('course.detail.courseInfo')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.courseCode')}
                    </p>
                    <p className="text-gray-900 dark:text-white">{course.course_code}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.professor')}
                    </p>
                    <p className="text-gray-900 dark:text-white">{course.professor}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.dayOfWeek')}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {t(`schedule.view.${course.day_of_week}`)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.startTime')} - {t('schedule.add.endTime')}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {course.start_time.substring(0, 5)} - {course.end_time.substring(0, 5)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('schedule.add.room')}
                    </p>
                    <p className="text-gray-900 dark:text-white">{course.room}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: migrateToPastelColor(course.color) }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('course.detail.courseColor')}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {t('course.detail.colorDescription')}
                </p>
              </div>
            </div>

            {/* Assignment List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('course.detail.assignmentList')}
                </h2>
                <Link
                  href="/assignment/add"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('assignments.list.addAssignment')}
                </Link>
              </div>
              
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t('course.detail.noAssignments')}
                  </p>
                  <Link
                    href="/assignment/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('course.detail.addFirstAssignment')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {assignment.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(assignment.priority)}`}>
                              {getPriorityText(assignment.priority)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {assignment.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {getDaysUntilDue(assignment.due_date)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            href={`/assignment/${assignment.id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('common.actions')}
              </h3>
              
              <div className="space-y-3">
                <Link
                  href={`/course/${course.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('common.edit')}
                </Link>
                
                <button 
                  onClick={handleDeleteCourse}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
