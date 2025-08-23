'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import Sidebar, { SidebarMenu } from '@/components/Sidebar';

// 임시 데이터
const sampleCourses = [
  {
    id: 1,
    name: '웹 프로그래밍 기초',
    code: 'CS101',
    professor: '김교수',
    dayOfWeek: 'monday',
    startTime: '09:00',
    endTime: '10:30',
    room: '101호',
    color: '#3b82f6'
  },
  {
    id: 2,
    name: '데이터베이스 시스템',
    code: 'CS201',
    professor: '이교수',
    dayOfWeek: 'tuesday',
    startTime: '13:00',
    endTime: '14:30',
    room: '202호',
    color: '#10b981'
  },
  {
    id: 3,
    name: '알고리즘과 자료구조',
    code: 'CS301',
    professor: '박교수',
    dayOfWeek: 'wednesday',
    startTime: '15:00',
    endTime: '16:30',
    room: '303호',
    color: '#f59e0b'
  }
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

export default function ScheduleViewPage() {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedMenu, setSelectedMenu] = useState<SidebarMenu>('schedule');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const daysOfWeek = [
    { value: 'monday', label: t('schedule.view.monday') },
    { value: 'tuesday', label: t('schedule.view.tuesday') },
    { value: 'wednesday', label: t('schedule.view.wednesday') },
    { value: 'thursday', label: t('schedule.view.thursday') },
    { value: 'friday', label: t('schedule.view.friday') },
    { value: 'saturday', label: t('schedule.view.saturday') },
    { value: 'sunday', label: t('schedule.view.sunday') }
  ];

  const getCoursesForTimeSlot = (day: string, time: string) => {
    return sampleCourses.filter(course => 
      course.dayOfWeek === day && 
      course.startTime === time
    );
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  // 사이드바 메뉴 변경 핸들러
  const handleMenuChange = (menu: SidebarMenu) => {
    setSelectedMenu(menu);
  };

  // 사이드바 토글 핸들러
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 현재 선택된 메뉴에 따른 콘텐츠 렌더링
  const renderContent = () => {
    switch (selectedMenu) {
      case 'schedule':
        return (
          <div className="space-y-6">
            {/* Actions */}
            <div>
              <Link
                href="/schedule/add"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('schedule.view.addCourse')}
              </Link>
            </div>

            {/* Day Selector */}
            <div>
              <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => setSelectedDay(day.value)}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      selectedDay === day.value
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
                {/* Time column header */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('schedule.view.time')}
                  </span>
                </div>
                
                {/* Day headers */}
                {daysOfWeek.map((day) => (
                  <div
                    key={day.value}
                    className={`p-3 text-center border-r border-gray-200 dark:border-gray-600 ${
                      selectedDay === day.value
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      selectedDay === day.value
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
                  {/* Time label */}
                  <div className="p-2 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatTime(time)}
                    </span>
                  </div>
                  
                  {/* Day cells */}
                  {daysOfWeek.map((day) => {
                    const courses = getCoursesForTimeSlot(day.value, time);
                    return (
                      <div
                        key={day.value}
                        className={`p-1 border-r border-gray-200 dark:border-gray-600 min-h-[60px] ${
                          selectedDay === day.value
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : ''
                        }`}
                      >
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className="p-2 rounded text-xs text-white mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: course.color }}
                          >
                            <div className="font-medium truncate">{course.name}</div>
                            <div className="opacity-90 truncate">{course.room}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Course List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('schedule.view.courseList')}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sampleCourses.map((course) => (
                    <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {course.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {course.code}
                              </span>
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {course.professor}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {course.startTime} - {course.endTime}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {course.room}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/course/${course.id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">과제 목록</h2>
            <p className="text-gray-600 dark:text-gray-400">과제 관리 기능이 여기에 표시됩니다.</p>
            <Link
              href="/assignment/list"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              과제 목록 페이지로 이동
            </Link>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">수업 목록</h2>
            <p className="text-gray-600 dark:text-gray-400">수업 관리 기능이 여기에 표시됩니다.</p>
            <Link
              href="/schedule/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              새 수업 추가
            </Link>
          </div>
        );

      case 'friends':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">친구 목록</h2>
            <p className="text-gray-600 dark:text-gray-400">친구 관리 기능이 여기에 표시됩니다.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">아직 구현되지 않았습니다.</p>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">설정</h2>
            <p className="text-gray-600 dark:text-gray-400">개인정보 및 앱 설정이 여기에 표시됩니다.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">아직 구현되지 않았습니다.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          selectedMenu={selectedMenu}
          onMenuChange={handleMenuChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="py-8 px-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedMenu === 'schedule' ? t('schedule.view.title') : 
                 selectedMenu === 'assignments' ? '과제 관리' :
                 selectedMenu === 'courses' ? '수업 관리' :
                 selectedMenu === 'friends' ? '친구 관리' : '설정'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {selectedMenu === 'schedule' ? t('schedule.view.subtitle') : 
                 selectedMenu === 'assignments' ? '과제를 체계적으로 관리하세요' :
                 selectedMenu === 'courses' ? '수업 정보를 관리하세요' :
                 selectedMenu === 'friends' ? '친구와 함께 학습하세요' : '앱 설정을 관리하세요'}
              </p>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
