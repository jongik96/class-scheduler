'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Clock, MapPin, User, BookOpen, Users, QrCode, Search, UserPlus, RefreshCw, AlertCircle, Calendar, Filter, CheckCircle, LogOut, CheckSquare, Settings, Square } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { migrateToPastelColor } from '@/lib/constants';
import demoData from '@/data/demo-schedule.json';

// 데모 전용 타입 정의
interface DemoCourse {
  id: string;
  course_name: string;
  course_code: string;
  professor: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
  color: string;
  description: string;
  is_active: boolean;
}

interface DemoAssignment {
  id: string;
  title: string;
  description: string;
  course_id: string;
  due_date: string;
  priority: string;
  status: string;
  is_shared: boolean;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

export default function DemoPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedMenu, setSelectedMenu] = useState<'schedule' | 'assignments' | 'courses' | 'friends' | 'settings'>('schedule');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState<DemoCourse[]>([]);
  const [assignments, setAssignments] = useState<DemoAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysOfWeek = [
    { value: 'monday', label: t('schedule.view.monday') },
    { value: 'tuesday', label: t('schedule.view.tuesday') },
    { value: 'wednesday', label: t('schedule.view.wednesday') },
    { value: 'thursday', label: t('schedule.view.thursday') },
    { value: 'friday', label: t('schedule.view.friday') }
  ];

  // 데모 데이터 로드
  useEffect(() => {
    setCourses(demoData.courses);
    setAssignments(demoData.assignments);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuChange = (menu: 'schedule' | 'assignments' | 'courses' | 'friends' | 'settings') => {
    setSelectedMenu(menu);
    setIsMobileMenuOpen(false);
  };

  const getCourseColor = (color: string) => {
    return migrateToPastelColor(color);
  };

  const getCoursesForDay = (day: string) => {
    return courses.filter(course => course.day_of_week === day);
  };

  const getCoursesForTimeSlot = (day: string, timeSlot: string) => {
    const dayCourses = getCoursesForDay(day);
    return dayCourses.filter(course => {
      const startTime = course.start_time;
      const endTime = course.end_time;
      return timeSlot >= startTime && timeSlot < endTime;
    });
  };

  const getCourseHeight = (course: DemoCourse) => {
    const startTime = course.start_time;
    const endTime = course.end_time;
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    return ((endIndex - startIndex) * 40) + 'px';
  };

  const getCourseTop = (course: DemoCourse) => {
    const startTime = course.start_time;
    const startIndex = timeSlots.indexOf(startTime);
    return (startIndex * 40) + 'px';
  };

  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('schedule.view.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('schedule.view.subtitle')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Square className="w-4 h-4 mr-2" />
            데모 종료
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {daysOfWeek.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDay(day.value)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedDay === day.value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="relative">
          {/* Time slots */}
          <div className="absolute left-0 top-0 w-16 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
            {timeSlots.map((time) => (
              <div key={time} className="h-10 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                {time}
              </div>
            ))}
          </div>

          {/* Course grid */}
          <div className="ml-16 relative min-h-[520px]">
            {daysOfWeek.map((day) => (
              <div
                key={day.value}
                className={`absolute top-0 w-full ${
                  selectedDay === day.value ? 'block' : 'hidden'
                }`}
              >
                {getCoursesForDay(day.value).map((course, index) => (
                  <div
                    key={course.id}
                    className="absolute left-0 right-0 p-2 text-white text-xs font-medium rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: getCourseColor(course.color),
                      top: getCourseTop(course),
                      height: getCourseHeight(course),
                      zIndex: 10 + index
                    }}
                    title={`${course.course_name} (${course.start_time} - ${course.end_time})`}
                  >
                    <div className="truncate">{course.course_name}</div>
                    <div className="truncate opacity-90">{course.room}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('assignments.list.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('assignments.list.subtitle')}
          </p>
        </div>
      </div>

      {/* Assignment List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">{t('common.noAssignments')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {assignment.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {assignment.course_id}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMenu) {
      case 'schedule':
        return renderSchedule();
      case 'assignments':
        return renderAssignments();
      case 'courses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('sidebarContent.courses.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('sidebarContent.courses.description')}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">
                데모 모드에서는 수업 관리 기능을 사용할 수 없습니다.
              </p>
            </div>
          </div>
        );
      case 'friends':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('friends.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('friends.title')}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">
                데모 모드에서는 친구 관리 기능을 사용할 수 없습니다.
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('sidebarContent.settings.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('sidebarContent.settings.description')}
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">
                데모 모드에서는 설정 기능을 사용할 수 없습니다.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 데모 모드 표시 */}
      <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                🎮 데모 모드로 실행 중입니다
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                실제 데이터가 아닌 샘플 데이터를 보고 있습니다
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-3 py-1 border border-yellow-300 dark:border-yellow-600 text-xs font-medium rounded text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-800/30 hover:bg-yellow-100 dark:hover:bg-yellow-700/50 transition-colors"
          >
            <Square className="w-3 h-3 mr-1" />
            데모 종료
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedMenu === 'schedule' ? t('schedule.view.title') : 
             selectedMenu === 'courses' ? t('sidebarContent.courses.title') :
             selectedMenu === 'assignments' ? t('assignments.list.title') :
             selectedMenu === 'friends' ? t('friends.title') : t('sidebarContent.settings.title')}
          </h1>
          <button
            onClick={handleMobileMenuToggle}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-1">
            {[
              { key: 'schedule', label: t('sidebar.schedule'), icon: Calendar },
              { key: 'assignments', label: t('sidebar.assignments'), icon: CheckSquare },
              { key: 'courses', label: t('sidebar.courses'), icon: BookOpen },
              { key: 'friends', label: t('sidebar.friends'), icon: Users },
              { key: 'settings', label: t('sidebar.settings'), icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleMenuChange(key as 'schedule' | 'assignments' | 'courses' | 'friends' | 'settings')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  selectedMenu === key
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-auto">
        <div className="py-4 sm:py-8 px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {selectedMenu === 'schedule' ? t('schedule.view.title') : 
               selectedMenu === 'courses' ? t('sidebarContent.courses.title') :
               selectedMenu === 'assignments' ? t('assignments.list.title') :
               selectedMenu === 'friends' ? t('friends.title') : t('sidebarContent.settings.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              {selectedMenu === 'schedule' ? t('schedule.view.subtitle') : 
               selectedMenu === 'courses' ? t('sidebarContent.courses.description') :
               selectedMenu === 'assignments' ? t('assignments.list.subtitle') :
               selectedMenu === 'friends' ? t('friends.title') : t('sidebarContent.settings.description')}
            </p>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="mb-6 hidden lg:block">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'schedule', label: t('sidebar.schedule'), icon: Calendar },
                  { key: 'assignments', label: t('sidebar.assignments'), icon: CheckSquare },
                  { key: 'courses', label: t('sidebar.courses'), icon: BookOpen },
                  { key: 'friends', label: t('sidebar.friends'), icon: Users },
                  { key: 'settings', label: t('sidebar.settings'), icon: Settings }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleMenuChange(key as 'schedule' | 'assignments' | 'courses' | 'friends' | 'settings')}
                    className={`group inline-flex items-center py-2 px-1 font-medium text-sm whitespace-nowrap ${
                      selectedMenu === key
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${
                      selectedMenu === key
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`} />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>

      {/* Theme and Language Switchers */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </div>
  );
}
