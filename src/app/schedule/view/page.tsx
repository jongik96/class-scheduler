'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Clock, MapPin, User, BookOpen, Users, QrCode, Search, UserPlus, RefreshCw, AlertCircle, Calendar, CheckSquare, Settings } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import Sidebar, { SidebarMenu } from '@/components/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';
import { coursesApi, type Course } from '@/lib/api';
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
    { value: 'saturday', label: t('schedule.view.saturday') },
    { value: 'sunday', label: t('schedule.view.sunday') }
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
      setCourses(coursesData);
    } catch (err) {
      console.error('수업 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '수업 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCoursesForTimeSlot = (day: string, time: string) => {
    const matchingCourses = courses.filter(course => {
      // 요일이 일치하는지 확인
      if (course.day_of_week !== day) return false;
      
      // 시간 매칭: 시작 시간이 현재 시간 슬롯과 일치하거나 포함되는지 확인
      const courseStartTime = course.start_time;
      const courseEndTime = course.end_time;
      const slotTime = time;
      
      // 시간 형식 통일 (HH:MM:SS -> HH:MM)
      const courseStart = courseStartTime.substring(0, 5);
      const courseEnd = courseEndTime.substring(0, 5);
      const slot = slotTime.substring(0, 5);
      
      // 시작 시간이 현재 슬롯과 일치하거나, 현재 슬롯이 수업 시간 범위 내에 있는지 확인
      const isMatch = courseStart === slot || (slot >= courseStart && slot < courseEnd);
      
      return isMatch;
    });
    
    return matchingCourses;
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
                      className={`flex-shrink-0 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
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
            </div>

            {/* Schedule Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
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
                              <Link
                                key={course.id}
                                href={`/course/${course.id}`}
                                className="block p-2 rounded text-xs text-white mb-1 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 group"
                                style={{ backgroundColor: migrateToPastelColor(course.color) }}
                                title={`${course.course_name} - ${course.room} (클릭하여 상세보기)`}
                              >
                                <div className="font-semibold truncate">{course.course_name}</div>
                                <div className="font-medium opacity-90 truncate">{course.room}</div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center mt-1 text-xs font-medium">
                                  👆 클릭
                                </div>
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
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
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      {t('common.loadingData')}
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>{error}</p>
                    <button
                      onClick={loadCourses}
                      className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
                      className="text-blue-600 hover:text-blue-500 text-sm"
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sidebarContent.assignments.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('sidebarContent.assignments.description')}</p>
            <Link
              href="/assignment/list"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t('sidebarContent.assignments.goToList')}
            </Link>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('sidebarContent.courses.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('sidebarContent.courses.description')}</p>
            <Link
              href="/schedule/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t('schedule.add.title')}
            </Link>
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
                   selectedMenu === 'assignments' ? t('assignments.list.title') :
                   selectedMenu === 'courses' ? t('schedule.add.title') :
                   selectedMenu === 'friends' ? t('friends.title') : t('sidebarContent.settings.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                  {selectedMenu === 'schedule' ? t('schedule.view.subtitle') : 
                   selectedMenu === 'assignments' ? t('assignments.list.subtitle') :
                   selectedMenu === 'courses' ? t('schedule.add.subtitle') :
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
    const friendsList = await getFriends();
    setFriends(friendsList);
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
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
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
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
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
                  <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
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
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
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
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {friend.friend_profile?.nickname || `Friend ${friend.friend_id.slice(0, 8)}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.friend_profile?.full_name || 'Unknown'} • {friend.friend_profile?.major || 'Unknown'} • {friend.friend_profile?.grade || 'Unknown'}{t('friendInvite.grade')}
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
                        {invite.inviter_profile?.nickname || `User ${invite.inviter_id.slice(0, 8)}`}{t('friendInvite.sentInvite')}
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

export default function ScheduleViewPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ScheduleViewContent />
    </AuthGuard>
  );
}
