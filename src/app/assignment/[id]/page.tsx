'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Clock, MapPin, Users, Share2, Eye, Edit3, Crown } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { getAssignmentShares, AssignmentShare } from '@/lib/friends-api';

export default function AssignmentDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const [assignment, setAssignment] = useState({
    id: '1',
    title: '웹 개발 프로젝트',
    description: 'React와 Node.js를 사용한 풀스택 웹 애플리케이션 개발',
    course: '웹 프로그래밍',
    dueDate: '2024-12-31',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-15'
  });
  const [sharedFriends, setSharedFriends] = useState<AssignmentShare[]>([]);
  const [isLoadingShares, setIsLoadingShares] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadAssignmentShares(params.id as string);
    }
  }, [params.id]);

  const loadAssignmentShares = async (assignmentId: string) => {
    setIsLoadingShares(true);
    try {
      const shares = await getAssignmentShares(assignmentId);
      setSharedFriends(shares);
    } catch (error) {
      console.error('공유 정보 로드 오류:', error);
    } finally {
      setIsLoadingShares(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'edit': return <Edit3 className="w-4 h-4 text-blue-600" />;
      case 'view': return <Eye className="w-4 h-4 text-green-600" />;
      default: return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPermissionText = (permission: string) => {
    switch (permission) {
      case 'admin': return '관리자';
      case 'edit': return '편집';
      case 'view': return '보기';
      default: return '보기';
    }
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
            과제 목록으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {assignment.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            과제 상세 정보 및 공유 현황
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">과제 정보</h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/assignment/${assignment.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    수정
                  </Link>
                  <button className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    과제 제목
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">{assignment.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    과제 설명
                  </label>
                  <p className="text-gray-900 dark:text-white">{assignment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      과목
                    </label>
                    <p className="text-gray-900 dark:text-white">{assignment.course}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      마감일
                    </label>
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <Clock className="w-4 h-4 mr-2" />
                      {assignment.dueDate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      우선순위
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority === 'high' ? '높음' : assignment.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      상태
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status === 'completed' ? '완료' : assignment.status === 'in_progress' ? '진행중' : '대기중'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">진행 상황</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>전체 진행률</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  아직 진행 상황이 기록되지 않았습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shared Friends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  공유된 친구
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {sharedFriends.length}명
                </span>
              </div>

              {isLoadingShares ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">로딩 중...</p>
                </div>
              ) : sharedFriends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">공유된 친구가 없습니다</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    과제를 친구와 공유해보세요
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sharedFriends.map((share) => (
                    <div key={share.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {share.shared_with_profile?.nickname || '알 수 없음'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {share.shared_with_profile?.full_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getPermissionIcon(share.permission)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getPermissionText(share.permission)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">빠른 작업</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  친구와 공유하기
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Clock className="w-4 h-4 mr-2" />
                  진행 상황 업데이트
                </button>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">과제 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">생성일</span>
                  <span className="text-gray-900 dark:text-white">{assignment.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">과제 ID</span>
                  <span className="text-gray-900 dark:text-white font-mono">{assignment.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
