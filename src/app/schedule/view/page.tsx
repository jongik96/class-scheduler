'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Clock, MapPin, User, BookOpen, Users, QrCode, Search, UserPlus } from 'lucide-react';
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
      console.log('✅ 수업 데이터 로드 성공:', coursesData);
    } catch (err) {
      console.error('❌ 수업 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '수업 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCoursesForTimeSlot = (day: string, time: string) => {
    return courses.filter(course => 
      course.day_of_week === day && 
      course.start_time === time
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

  // 수업 삭제 핸들러
  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('정말로 이 수업을 삭제하시겠습니까?')) {
      try {
        await coursesApi.deleteCourse(courseId);
        console.log('✅ 수업 삭제 성공');
        await loadCourses(); // 목록 새로고침
      } catch (err) {
        console.error('❌ 수업 삭제 실패:', err);
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
                {t('schedule.view.addCourse')}
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
                            <div className="font-medium truncate">{course.course_name}</div>
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
                  {courses.map((course) => (
                    <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {course.course_name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                {course.course_code}
                              </span>
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {course.professor}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {course.start_time} - {course.end_time}
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
          {/* Sidebar */}
          <Sidebar
            selectedMenu={selectedMenu}
            onMenuChange={handleMenuChange}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-auto">
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
  const [inviteLink, setInviteLink] = useState<string>('');
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
        setInviteLink(result.invite_url);
      }
    } catch (error) {
      console.error('Invite link generation error:', error);
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
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
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mobile-button-group">
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
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 sm:flex-shrink-0"
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
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* Invite by Link */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">{t('friends.generateInviteLink')}</h4>
            {inviteLink ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-md text-sm transition-colors sm:flex-shrink-0 ${
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
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Friends will be automatically added when they scan the QR code
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              (Coming soon)
            </p>
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
                        {friend.friend_profile?.nickname || t('common.unknown')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.friend_profile?.full_name} • {friend.friend_profile?.major} • {friend.friend_profile?.grade}{t('friendInvite.grade')}
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
                        {invite.inviter_profile?.nickname || t('common.unknown')}{t('friendInvite.sentInvite')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invite.inviter_profile?.full_name} • {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
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
