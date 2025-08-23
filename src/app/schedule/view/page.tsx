'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Clock, MapPin, User, BookOpen, Users, QrCode, Search, UserPlus } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import Sidebar, { SidebarMenu } from '@/components/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { 
  getFriends, 
  getReceivedInvites, 
  createFriendInvite, 
  searchUsers, 
  removeFriend,
  Friend,
  FriendInvite
} from '@/lib/friends-api';

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
          <FriendsManagementPage />
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

// 친구 관리 페이지 컴포넌트
function FriendsManagementPage() {
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
      console.error('초대 링크 생성 오류:', error);
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
      console.error('링크 복사 오류:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (confirm('정말로 이 친구를 삭제하시겠습니까?')) {
      const success = await removeFriend(friendId);
      if (success) {
        await loadFriends();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">친구 관리</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            친구 찾기
          </button>
          <button
            onClick={handleGenerateInvite}
            disabled={isGeneratingInvite}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Users className="w-4 h-4 mr-2" />
            {isGeneratingInvite ? '생성 중...' : '친구 초대하기'}
          </button>
        </div>
      </div>

      {/* 친구 검색 */}
      {showSearch && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">친구 찾기</h3>
          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 닉네임, 전공으로 검색"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors disabled:opacity-50"
            >
              {isSearching ? '검색 중...' : '검색'}
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white">검색 결과</h4>
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.nickname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.full_name} • {user.major}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                    초대하기
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 친구 초대 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">친구 초대하기</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 링크로 초대하기 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">링크로 초대하기</h4>
            {inviteLink ? (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
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
                    {copied ? '복사됨!' : '복사'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  이 링크를 친구에게 보내서 초대하세요
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-2">아직 초대 링크가 생성되지 않았습니다</p>
                <button
                  onClick={handleGenerateInvite}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  초대 링크 생성하기
                </button>
              </div>
            )}
          </div>

          {/* QR코드로 초대하기 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">QR코드로 초대하기</h4>
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              친구가 QR코드를 스캔하면 자동으로 추가됩니다
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              (추후 구현 예정)
            </p>
          </div>
        </div>
      </div>

      {/* 친구 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">친구 목록 ({friends.length})</h3>
        </div>
        <div className="p-6">
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">아직 친구가 없습니다</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                친구 초대하기 버튼을 눌러서 친구를 추가해보세요
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
                        {friend.friend_profile?.nickname || '알 수 없음'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.friend_profile?.full_name} • {friend.friend_profile?.major} • {friend.friend_profile?.grade}학년
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.friend_id)}
                    className="text-red-600 hover:text-red-500 text-sm font-medium"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 받은 초대 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">받은 초대 ({receivedInvites.length})</h3>
        </div>
        <div className="p-6">
          {receivedInvites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">받은 초대가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedInvites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {invite.inviter_profile?.nickname || '알 수 없음'}님이 친구 초대
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invite.inviter_profile?.full_name} • {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors">
                      수락
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors">
                      거절
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
