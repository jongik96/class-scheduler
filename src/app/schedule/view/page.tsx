'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Clock, MapPin, User, BookOpen, Users, QrCode, Search, UserPlus, RefreshCw, AlertCircle, Calendar, CheckSquare, Settings, Filter, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import Sidebar, { SidebarMenu } from '@/components/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';
import { coursesApi, type Course, assignmentsApi, type Assignment } from '@/lib/api';
import { 
  getFriends, 
  getReceivedInvites, 
  createFriendInvite, 
  searchUsers, 
  removeFriend,
  Friend,
  FriendInvite
} from '@/lib/friends-api';
import { migrateToPastelColor } from '@/lib/constants';
import QRCode from 'react-qr-code';
import React from 'react'; // Added missing import for React

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

function ScheduleViewContent() {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedMenu, setSelectedMenu] = useState<SidebarMenu>('schedule');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const daysOfWeek = [
    { value: 'monday', label: t('schedule.view.monday') },
    { value: 'tuesday', label: t('schedule.view.tuesday') },
    { value: 'wednesday', label: t('schedule.view.wednesday') },
    { value: 'thursday', label: t('schedule.view.thursday') },
    { value: 'friday', label: t('schedule.view.friday') },
    { value: 'saturday', label: t('schedule.view.saturday') }
  ];

  // 수업 데이터 로드
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const coursesData = await coursesApi.getCourses();
      console.log('✅ 로드된 수업 데이터:', coursesData);
      setCourses(coursesData);
    } catch (err) {
      console.error('수업 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '수업 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCoursesForTimeSlot = (day: string, time: string) => {
    const filteredCourses = courses.filter(course => {
      // 요일이 일치하는지 확인
      if (course.day_of_week !== day) return false;
      
      // 시간 형식 통일 (HH:MM:SS -> HH:MM)
      const courseStart = course.start_time.substring(0, 5);
      const courseEnd = course.end_time.substring(0, 5);
      const slot = time.substring(0, 5);
      
      // 현재 슬롯이 수업 시간 범위 내에 있는지 확인
      const isMatch = slot >= courseStart && slot < courseEnd;
      
      if (isMatch) {
        console.log(`✅ ${day} ${time}에 매칭된 수업:`, course.course_name, `${courseStart}-${courseEnd}`);
      }
      
      return isMatch;
    });
    
    return filteredCourses;
  };

  // 연속된 시간의 수업을 병합하여 표시할 셀 정보를 계산
  const getMergedCourseCells = (day: string, time: string) => {
    const courses = getCoursesForTimeSlot(day, time);
    if (courses.length === 0) return null;

    const course = courses[0]; // 하나의 요일/시간에 하나의 수업만 있을 수 있음
    
    // 수업 시작 시간과 현재 시간 슬롯이 일치하는 경우에만 병합 셀 표시
    const courseStart = course.start_time.substring(0, 5);
    if (courseStart !== time) return null;

    // 수업이 몇 개의 30분 슬롯을 차지하는지 계산
    const startMinutes = parseInt(courseStart.split(':')[0]) * 60 + parseInt(courseStart.split(':')[1]);
    const endMinutes = parseInt(course.end_time.substring(0, 5).split(':')[0]) * 60 + parseInt(course.end_time.substring(0, 5).split(':')[1]);
    const durationSlots = Math.ceil((endMinutes - startMinutes) / 30);

    return {
      course,
      durationSlots,
      isStart: true
    };
  };

  // 시간표 그리드의 행 수를 계산 (연속된 수업을 고려하여)
  const getGridRows = () => {
    const gridRows = [];
    for (let i = 0; i < timeSlots.length; i++) {
      const time = timeSlots[i];
      let rowHeight = '50px'; // 모바일에서 더 작게
      
      // 현재 시간에 시작하는 수업이 있는지 확인
      daysOfWeek.forEach(day => {
        const mergedCell = getMergedCourseCells(day.value, time);
        if (mergedCell && mergedCell.durationSlots > 1) {
          rowHeight = `${mergedCell.durationSlots * 50}px`; // 모바일에서 더 작게
        }
      });
      
      gridRows.push(rowHeight);
    }
    return gridRows.join(' ');
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

  // 수업 삭제 핸들러
  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('정말로 이 수업을 삭제하시겠습니까?')) {
      try {
        await coursesApi.deleteCourse(courseId);
        await loadCourses(); // 목록 새로고침
      } catch (err) {
        console.error('수업 삭제 실패:', err);
        alert('수업 삭제에 실패했습니다.');
      }
    }
  };

  // 현재 선택된 메뉴에 따른 콘텐츠 렌더링
  const renderContent = () => {
    switch (selectedMenu) {
      case 'schedule':
        return (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/schedule/add"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('common.addCourse')}
              </Link>
              
              <button
                onClick={loadCourses}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    새로고침 중...
                  </>
                ) : (
                  '새로고침'
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  수업 데이터를 불러오는 중...
                </p>
              </div>
            )}

            {/* Day Selector */}
            <div>
              <div className="overflow-x-auto">
                <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow min-w-max">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => setSelectedDay(day.value)}
                      className={`flex-shrink-0 py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        selectedDay === day.value
                          ? 'bg-[#BAE1FF] text-gray-800'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-[600px] md:min-w-[800px]">
                  <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                    {/* Time column header */}
                    <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('schedule.view.time')}
                      </span>
                    </div>
                    
                    {/* Day headers */}
                    {daysOfWeek.map((day) => (
                      <div
                        key={day.value}
                        className={`p-2 sm:p-3 text-center border-r border-gray-200 dark:border-gray-600 ${
                          selectedDay === day.value
                            ? 'bg-[#E0F2FE] dark:bg-[#BAE1FF]/20'
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`text-xs sm:text-sm font-medium ${
                          selectedDay === day.value
                            ? 'text-[#1E40AF] dark:text-[#BAE1FF]'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>

                   {/* Time slots */}
                   {timeSlots.map((time, timeIndex) => {
                     // 현재 시간에 시작하는 수업이 있는지 확인하고 병합할 행 수 계산
                     let maxDurationSlots = 1;
                     daysOfWeek.forEach(day => {
                       const courses = getCoursesForTimeSlot(day.value, time);
                       const isStartTime = courses.some(course => 
                         course.start_time.substring(0, 5) === time
                       );
                       if (isStartTime && courses.length > 0) {
                         const course = courses[0];
                         const startMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                         const endMinutes = parseInt(course.end_time.substring(0, 5).split(':')[0]) * 60 + parseInt(course.end_time.substring(0, 5).split(':')[1]);
                         const durationSlots = Math.ceil((endMinutes - startMinutes) / 30);
                         maxDurationSlots = Math.max(maxDurationSlots, durationSlots);
                       }
                     });

                     return (
                       <div 
                         key={time} 
                         className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700"
                         style={{ minHeight: `${maxDurationSlots * 50}px` }}
                       >
                         {/* Time label */}
                         <div className="p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 flex items-center">
                           <span className="text-xs text-gray-600 dark:text-gray-400">
                             {formatTime(time)}
                           </span>
                         </div>
                         
                         {/* Day cells */}
                         {daysOfWeek.map((day) => {
                           const courses = getCoursesForTimeSlot(day.value, time);
                           
                           // 현재 시간에 시작하는 수업이 있는지 확인
                           const startTimeCourses = courses.filter(course => 
                             course.start_time.substring(0, 5) === time
                           );
                           
                           // 현재 시간에 시작하는 수업이 있다면 표시
                           if (startTimeCourses.length > 0) {
                             const course = startTimeCourses[0];
                             const startMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                             const endMinutes = parseInt(course.end_time.substring(0, 5).split(':')[0]) * 60 + parseInt(course.end_time.substring(0, 5).split(':')[1]);
                             const durationSlots = Math.ceil((endMinutes - startMinutes) / 30);
                             
                             return (
                               <div
                                 key={day.value}
                                 className={`p-1 border-r border-gray-200 dark:border-gray-600 ${
                                   selectedDay === day.value
                                     ? 'bg-[#E0F2FE] dark:bg-[#BAE1FF]/10'
                                     : ''
                                 }`}
                               >
                                 <Link
                                   href={`/course/${course.id}`}
                                   className="block p-1 sm:p-2 rounded text-xs text-white mb-1 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 group h-full flex flex-col justify-center"
                                   style={{ backgroundColor: migrateToPastelColor(course.color) }}
                                   title={`${course.course_name} - ${course.room} (클릭하여 상세보기)`}
                                 >
                                   <div className="font-semibold truncate text-xs sm:text-sm">{course.course_name}</div>
                                   <div className="font-medium opacity-90 truncate text-xs">{course.room}</div>
                                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center mt-1 text-xs font-medium">
                                     👆 클릭
                                   </div>
                                 </Link>
                               </div>
                             );
                           } else if (courses.length > 0) {
                             // 수업이 있지만 시작 시간이 아닌 경우 (병합된 셀의 일부)
                             return (
                               <div
                                 key={day.value}
                                 className={`p-1 border-r border-gray-200 dark:border-gray-600 ${
                                   selectedDay === day.value
                                     ? 'bg-[#E0F2FE] dark:bg-[#BAE1FF]/10'
                                     : ''
                                 }`}
                               >
                                 {/* 이 셀은 병합된 수업의 일부이므로 내용을 표시하지 않음 */}
                               </div>
                             );
                           } else {
                             // 수업이 없는 경우 빈 셀
                             return (
                               <div
                                 key={day.value}
                                 className={`p-1 border-r border-gray-200 dark:border-gray-600 ${
                                   selectedDay === day.value
                                     ? 'bg-[#E0F2FE] dark:bg-[#BAE1FF]/10'
                                     : ''
                                 }`}
                               >
                                 {/* 빈 셀 */}
                               </div>
                             );
                           }
                         })}
                       </div>
                     );
                   })}
                </div>
              </div>
            </div>

            {/* Course List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('schedule.view.courseList')} ({courses.length}개)
              </h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {isLoading ? (
                  <div className="bg-[#E0F2FE] dark:bg-[#BAE1FF]/20 border border-[#BAE1FF] dark:border-[#BAE1FF]/30 rounded-md p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E40AF] mx-auto mb-2"></div>
                    <p className="text-[#1E40AF] dark:text-[#BAE1FF] text-sm">
                      {t('common.loadingData')}
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>{error}</p>
                    <button
                      onClick={loadCourses}
                      className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {t('common.refresh')}
                    </button>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{t('common.noCourses')}</p>
                    <Link
                      href="/schedule/add"
                      className="text-[#1E40AF] hover:text-[#BAE1FF] text-sm"
                    >
                      {t('common.addFirstCourse')}
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {courses.map((course) => (
                      <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: migrateToPastelColor(course.color) }}
                            />
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {course.course_name}
                              </h3>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center font-medium">
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  {course.course_code}
                                </span>
                                <span className="flex items-center font-medium">
                                  <User className="w-4 h-4 mr-1" />
                                  {course.professor}
                                </span>
                                <span className="flex items-center font-medium">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {course.start_time.substring(0, 5)} - {course.end_time.substring(0, 5)}
                                </span>
                                <span className="flex items-center font-medium">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {course.room}
                                </span>
                                <span className="flex items-center font-medium">
                                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: migrateToPastelColor(course.color) }}></span>
                                  {course.day_of_week}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link
                              href={`/course/${course.id}`}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/course/${course.id}/edit`}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
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
          </div>
        );

      case 'assignments':
        return (
          <AssignmentListContent />
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sidebarContent.courses.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('sidebarContent.courses.description')}</p>
            
            {/* Course List */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('schedule.view.courseList')} ({courses.length}개)
              </h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {isLoading ? (
                  <div className="bg-[#E0F2FE] dark:bg-[#BAE1FF]/20 border border-[#BAE1FF] dark:border-[#BAE1FF]/30 rounded-md p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E40AF] mx-auto mb-2"></div>
                    <p className="text-[#1E40AF] dark:text-[#BAE1FF] text-sm">
                      {t('common.loadingData')}
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>{error}</p>
                    <button
                      onClick={loadCourses}
                      className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {t('common.refresh')}
                    </button>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{t('common.noCourses')}</p>
                    <Link
                      href="/schedule/add"
                      className="text-[#1E40AF] hover:text-[#BAE1FF] text-sm"
                    >
                      {t('common.addFirstCourse')}
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {courses.map((course) => (
                      <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: migrateToPastelColor(course.color) }}
                            />
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {course.course_name}
                              </h3>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center font-medium">
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  {course.course_code}
                                </span>
                                <span className="flex items-center font-medium">
                                  <User className="w-4 h-4 mr-1" />
                                  {course.professor}
                                </span>
                                <span className="flex items-center font-medium">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {course.start_time.substring(0, 5)} - {course.end_time.substring(0, 5)}
                                </span>
                                <span className="flex items-center font-medium">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {course.room}
                                </span>
                                <span className="flex items-center font-medium">
                                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: migrateToPastelColor(course.color) }}></span>
                                  {course.day_of_week}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link
                              href={`/course/${course.id}`}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/course/${course.id}/edit`}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
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
            
            <div className="flex justify-center">
              <Link
                href="/schedule/add"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('schedule.add.title')}
              </Link>
            </div>
          </div>
        );

      case 'friends':
        return (
          <FriendsManagementPage />
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sidebarContent.settings.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('sidebarContent.settings.description')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Not implemented yet.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen">
          {/* Sidebar - 모바일에서 슬라이드형 */}
          <div className={`${isSidebarCollapsed ? 'hidden sm:block' : ''} sm:block`}>
            <Sidebar
              selectedMenu={selectedMenu}
              onMenuChange={handleMenuChange}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleSidebarToggle}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-auto w-full sm:w-auto">
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
                
                {/* Mobile Menu Toggle Button */}
                <div className="sm:hidden mt-4">
                  <button
                    onClick={handleSidebarToggle}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {isSidebarCollapsed ? '메뉴 열기' : '메뉴 닫기'}
                  </button>
                </div>
              </div>

              {/* Content */}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

// 친구 관리 페이지 컴포넌트
function FriendsManagementPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<FriendInvite[]>([]);
  const [inviteData, setInviteData] = useState<{ invite_code: string; invite_url: string } | null>(null);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    full_name: string;
    nickname: string;
    major?: string;
    grade?: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadFriends();
      loadReceivedInvites();
    }
  }, [user]);

  const loadFriends = async () => {
    console.log('Loading friends...');
    try {
      const friendsList = await getFriends();
      console.log('Loaded friends:', friendsList);
      console.log('Friends with profiles:', friendsList.map(f => ({
        id: f.id,
        friend_id: f.friend_id,
        profile: f.friend_profile
      })));
      setFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadReceivedInvites = async () => {
    const invites = await getReceivedInvites();
    setReceivedInvites(invites);
  };

  const handleGenerateInvite = async () => {
    setIsGeneratingInvite(true);
    try {
      const result = await createFriendInvite();
      if (result) {
        setInviteData(result);
      }
    } catch (error) {
      console.error('Invite link generation error:', error);
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteData) return;
    try {
      await navigator.clipboard.writeText(inviteData.invite_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Link copy error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (confirm(t('friends.confirmRemove'))) {
      const success = await removeFriend(friendId);
      if (success) {
        await loadFriends();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('friends.title')}</h2>
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            {t('friends.findFriends')}
          </button>
          <button
            onClick={handleGenerateInvite}
            disabled={isGeneratingInvite}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors disabled:opacity-50"
          >
            <Users className="w-4 h-4 mr-2" />
            {isGeneratingInvite ? t('friends.generating') : t('friends.inviteFriends')}
          </button>
        </div>
      </div>

      {/* Friend Search */}
      {showSearch && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('friends.findFriends')}</h3>
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('friends.searchPlaceholder')}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E40AF] dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-[#BAE1FF] hover:bg-[#87CEEB] text-gray-800 rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {isSearching ? t('friends.searching') : t('friends.search')}
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">{t('friends.searchResults')}</h4>
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.nickname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.full_name} • {user.major}</p>
                  </div>
                  <button className="text-[#1E40AF] hover:text-[#BAE1FF] text-sm font-medium">
                    {t('friends.invite')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Friend Invitation Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('friends.inviteFriends')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Invite by Link */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">{t('friends.generateInviteLink')}</h4>
            {inviteData ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={inviteData.invite_url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {copied ? t('friends.linkCopied') : t('friends.copyLink')}
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Send this link to your friends to invite them
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-2">No invite link generated yet</p>
                <button
                  onClick={handleGenerateInvite}
                  className="text-[#1E40AF] hover:text-[#BAE1FF] text-sm font-medium"
                >
                  {t('friends.generateInviteLink')}
                </button>
              </div>
            )}
          </div>

          {/* Invite by QR Code */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">{t('friends.qrCode')}</h4>
            {inviteData ? (
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border mb-4">
                  <QRCode value={inviteData.invite_url} size={150} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('friends.qrCodeDescription')}
                </p>
                <button
                  onClick={() => window.open(`/friends/qr/${inviteData.invite_code}`, '_blank')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('friends.addFriends')}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('friends.qrCodePlaceholder')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('friends.friendsList')} ({friends.length})</h3>
        </div>
        <div className="p-4 sm:p-6">
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">{t('friends.noFriends')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Click the invite friends button to add friends
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#E0F2FE] dark:bg-[#BAE1FF]/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#1E40AF] dark:text-[#BAE1FF]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {friend.friend_profile?.nickname || friend.friend_profile?.full_name || `Friend ${friend.friend_id.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.friend_profile?.full_name || 'Unknown'} • {friend.friend_profile?.major || 'Unknown'} • {friend.friend_profile?.grade || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.friend_id)}
                    className="text-red-600 hover:text-red-500 text-sm font-medium"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Received Invites */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('friends.receivedInvites')} ({receivedInvites.length})</h3>
        </div>
        <div className="p-4 sm:p-6">
          {receivedInvites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">{t('friends.noInvites')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedInvites.map((invite) => (
                <div key={invite.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {invite.inviter_profile?.nickname || invite.inviter_profile?.full_name || `User ${invite.inviter_id.slice(0, 8)}`}{t('friendInvite.sentInvite')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invite.inviter_profile?.full_name || 'Unknown'} • {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-shrink-0">
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors">
                      {t('friends.accept')}
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                      {t('friends.reject')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 과제 목록 컴포넌트
function AssignmentListContent() {
  const { t } = useLanguage();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await assignmentsApi.getAssignments();
      setAssignments(data);
      console.log('✅ 과제 데이터 로드 성공:', data);
    } catch (err) {
      console.error('❌ 과제 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '과제 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
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
      return { days: Math.abs(diffDays), isOverdue: true };
    } else if (diffDays === 0) {
      return { days: 0, isOverdue: false };
    } else {
      return { days: diffDays, isOverdue: false };
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (assignment.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (assignment.course_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: assignments.length,
    inProgress: assignments.filter(a => a.status === 'pending').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => {
      const dueInfo = getDaysUntilDue(a.due_date);
      return dueInfo.isOverdue;
    }).length
  };

  return (
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
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={loadAssignments}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                {t('common.refreshing')}
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('common.refresh')}
              </>
            )}
          </button>
          <Link
            href="/assignment/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('assignments.list.addAssignment')}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#E0F2FE] dark:bg-[#BAE1FF]/20 rounded-lg">
              <Calendar className="w-6 h-6 text-[#1E40AF] dark:text-[#BAE1FF]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('assignments.list.total')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('assignments.list.inProgress')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('assignments.list.completed')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('assignments.list.overdue')}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.overdue}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('assignments.list.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E40AF] dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E40AF] dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">{t('assignments.list.allStatus')}</option>
                <option value="pending">{t('assignments.list.pending')}</option>
                <option value="completed">{t('assignments.list.completed')}</option>
                <option value="overdue">{t('assignments.list.overdue')}</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E40AF] dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">{t('assignments.list.allPriority')}</option>
                <option value="high">{t('priority.high')}</option>
                <option value="medium">{t('priority.medium')}</option>
                <option value="low">{t('priority.low')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">{t('common.loadingAssignments')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>{error}</p>
            <button
              onClick={loadAssignments}
              className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-[#BAE1FF] hover:bg-[#87CEEB] transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('common.refresh')}
            </button>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">{t('common.noAssignments')}</p>
            <Link
              href="/assignment/add"
              className="text-[#1E40AF] hover:text-[#BAE1FF] text-sm"
            >
              {t('common.addFirstAssignment')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(assignment.status)}
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
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {assignment.course_id}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {getDaysUntilDue(assignment.due_date).days === 0 ? t('dueDate.today') : getDaysUntilDue(assignment.due_date).days === 1 ? t('dueDate.tomorrow') : t('dueDate.daysLeft', { days: getDaysUntilDue(assignment.due_date).days })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/assignment/${assignment.id}`}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#1E40AF] dark:hover:text-[#BAE1FF] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/assignment/${assignment.id}/edit`}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScheduleViewPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ScheduleViewContent />
    </AuthGuard>
  );
}
