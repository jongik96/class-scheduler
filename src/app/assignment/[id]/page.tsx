'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Clock, Users, Share2, Eye, Edit3, Crown, X } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { 
  getAssignmentShares, 
  AssignmentShare, 
  getFriends, 
  Friend,
  shareAssignmentWithFriends,
  updateAssignmentSharePermission,
  getAssignmentProgress,
  AssignmentProgress,
  updateAssignmentProgress
} from '@/lib/friends-api';
import { assignmentsApi, type Assignment } from '@/lib/api';

export default function AssignmentDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharedFriends, setSharedFriends] = useState<AssignmentShare[]>([]);
  const [isLoadingShares, setIsLoadingShares] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [assignmentProgress, setAssignmentProgress] = useState<AssignmentProgress[]>([]);
  
  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showProgressViewModal, setShowProgressViewModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [sharePermission, setSharePermission] = useState<'view' | 'edit' | 'admin'>('view');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressStatus, setProgressStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      loadAssignment(params.id as string);
      loadAssignmentShares(params.id as string);
      loadFriends();
      loadAssignmentProgress(params.id as string);
    }
  }, [params.id]);

  const loadAssignment = async (assignmentId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await assignmentsApi.getAssignment(assignmentId);
      setAssignment(data);
    } catch (err) {
      console.error('❌ 과제 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '과제 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssignmentShares = async (assignmentId: string) => {
    setIsLoadingShares(true);
    try {
      console.log('Loading assignment shares for:', assignmentId);
      const shares = await getAssignmentShares(assignmentId);
      console.log('Loaded shares:', shares);
      setSharedFriends(shares);
    } catch (error) {
      console.error('Error loading share information:', error);
    } finally {
      setIsLoadingShares(false);
    }
  };

  const loadFriends = async () => {
    try {
      const friendsList = await getFriends();
      setFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadAssignmentProgress = async (assignmentId: string) => {
    try {
      const progress = await getAssignmentProgress(assignmentId);
      setAssignmentProgress(progress);
    } catch (error) {
      console.error('Error loading assignment progress:', error);
    }
  };

  const handleShareAssignment = async () => {
    if (!assignment || selectedFriends.length === 0) return;
    
    try {
      const success = await shareAssignmentWithFriends(assignment.id, selectedFriends, sharePermission);
      if (success) {
        await loadAssignmentShares(assignment.id);
        setShowShareModal(false);
        setSelectedFriends([]);
        setSharePermission('view');
      }
    } catch (error) {
      console.error('Error sharing assignment:', error);
    }
  };

  const handleUpdateProgress = async () => {
    if (!assignment) return;
    
    try {
      const success = await updateAssignmentProgress(
        assignment.id,
        progressPercentage,
        progressStatus,
        progressNotes
      );
      if (success) {
        // Reload progress data to show updated information
        await loadAssignmentProgress(assignment.id);
        setShowProgressModal(false);
        setProgressPercentage(0);
        setProgressStatus('pending');
        setProgressNotes('');
        
        // Show success message (optional)
        console.log('Progress updated successfully!');
      } else {
        console.error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };


  const handleUpdateSharePermission = async (shareId: string, permission: 'view' | 'edit' | 'admin') => {
    try {
      const success = await updateAssignmentSharePermission(shareId, permission);
      if (success && assignment) {
        await loadAssignmentShares(assignment.id);
      }
    } catch (error) {
      console.error('Error updating share permission:', error);
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
      case 'admin': return t('assignments.detail.admin');
      case 'edit': return t('assignments.detail.editPermission');
      case 'view': return t('assignments.detail.viewPermission');
      default: return t('assignments.detail.viewPermission');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">과제를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            <p className="mb-4">{error || '과제를 찾을 수 없습니다.'}</p>
            <Link
              href="/schedule/view?menu=assignments"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
             href="/schedule/view?menu=assignments"
             className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
           >
             <ArrowLeft className="w-4 h-4 mr-2" />
             {t('common.backToAssignmentList')}
           </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {assignment.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('assignments.detail.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('assignments.detail.assignmentInfo')}</h2>
                <div className="flex gap-2 mobile-button-group">
                  <Link
                    href={`/assignment/${assignment.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {t('assignments.detail.edit')}
                  </Link>
                  <button className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('assignments.detail.delete')}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('assignments.detail.assignmentTitle')}
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">{assignment.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('assignments.detail.assignmentDescription')}
                  </label>
                  <p className="text-gray-900 dark:text-white">{assignment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('assignments.detail.course')}
                    </label>
                    <p className="text-gray-900 dark:text-white">{assignment.course_id || t('assignments.detail.noCourse')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('assignments.detail.dueDate')}
                    </label>
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('assignments.detail.priority')}
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                      {t(`priority.${assignment.priority}`)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('assignments.detail.status')}
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {t(`assignments.detail.status.${assignment.status}`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('assignments.detail.progress')}</h3>
              <div className="space-y-6">
                {(() => {
                  // Find current user's progress
                  const currentUserProgress = assignmentProgress.find(p => p.user_id === assignment?.user_id);
                  
                  // Calculate team average progress
                  const teamAverageProgress = assignmentProgress.length > 0 
                    ? Math.round(assignmentProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / assignmentProgress.length)
                    : 0;
                  
                  return (
                    <div className="space-y-4">
                      {/* Personal Progress */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('assignments.detail.progressSection.personalProgress')}</h4>
                        {currentUserProgress ? (
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>{t('assignments.detail.progressSection.progressRate')}</span>
                              <span>{currentUserProgress.progress_percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${currentUserProgress.progress_percentage}%` }}
                              ></div>
                            </div>
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                currentUserProgress.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                currentUserProgress.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}>
                                {currentUserProgress.status === 'completed' ? t('assignments.detail.progressModal.completed') :
                                 currentUserProgress.status === 'in_progress' ? t('assignments.detail.progressModal.inProgress') : 
                                 t('assignments.detail.progressModal.pending')}
                              </span>
                            </div>
                            {currentUserProgress.notes && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <strong>{t('assignments.detail.progressSection.memo')}:</strong> {currentUserProgress.notes}
                                </p>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {t('assignments.detail.progressSection.lastUpdate')}: {new Date(currentUserProgress.updated_at).toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                              <span>{t('assignments.detail.progressSection.progressRate')}</span>
                              <span>0%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              {t('assignments.detail.noProgress')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Team Progress */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('assignments.detail.progressSection.teamProgress')} 
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({assignmentProgress.length}{t('assignments.detail.progressSection.participants')})
                          </span>
                        </h4>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>{t('assignments.detail.progressSection.averageProgress')}</span>
                          <span>{teamAverageProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${teamAverageProgress}%` }}
                          ></div>
                        </div>
                        {assignmentProgress.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {assignmentProgress.filter(p => p.status === 'completed').length}{t('assignments.detail.progressSection.completed')}, 
                            {assignmentProgress.filter(p => p.status === 'in_progress').length}{t('assignments.detail.progressSection.inProgress')}, 
                            {assignmentProgress.filter(p => p.status === 'pending').length}{t('assignments.detail.progressSection.pending')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shared Friends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  {t('assignments.detail.sharedFriends')}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('assignments.detail.sharedFriendsCount', { count: sharedFriends.length })}
                </span>
              </div>

              {isLoadingShares ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('assignments.detail.loading')}</p>
                </div>
              ) : sharedFriends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">{t('assignments.detail.noSharedFriends')}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t('assignments.detail.shareWithFriends')}
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
                            {share.shared_with_profile?.full_name || share.shared_with_profile?.nickname || t('common.unknown')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {share.shared_with_profile?.nickname}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowProgressViewModal(true)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title={t('assignments.detail.sharedFriends.viewProgress')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="flex items-center space-x-2">
                          {getPermissionIcon(share.permission)}
                          <select
                            value={share.permission}
                            onChange={(e) => handleUpdateSharePermission(share.id, e.target.value as 'view' | 'edit' | 'admin')}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            title={t('assignments.detail.sharedFriends.changePermission')}
                          >
                            <option value="view">{t('assignments.detail.shareModal.viewOnly')}</option>
                            <option value="edit">{t('assignments.detail.shareModal.editPermission')}</option>
                            <option value="admin">{t('assignments.detail.shareModal.adminPermission')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('assignments.detail.quickActions')}</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('assignments.detail.shareAssignment')}
                </button>
                <button 
                  onClick={() => setShowProgressModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {t('assignments.detail.updateProgress')}
                </button>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('assignments.detail.assignmentInfoSidebar')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('assignments.detail.createdDate')}</span>
                  <span className="text-gray-900 dark:text-white">{assignment.created_at ? new Date(assignment.created_at).toLocaleDateString() : t('common.unknown')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('assignments.detail.assignmentId')}</span>
                  <span className="text-gray-900 dark:text-white font-mono">{assignment.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Assignment Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('assignments.detail.shareModal.title')}
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('assignments.detail.shareModal.permissionLabel')}
                    </label>
                    <select
                      value={sharePermission}
                      onChange={(e) => setSharePermission(e.target.value as 'view' | 'edit' | 'admin')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="view">{t('assignments.detail.shareModal.viewOnly')}</option>
                      <option value="edit">{t('assignments.detail.shareModal.editPermission')}</option>
                      <option value="admin">{t('assignments.detail.shareModal.adminPermission')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('assignments.detail.shareModal.friendSelectionLabel')}
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(() => {
                        // Get already shared friend IDs
                        const alreadySharedIds = sharedFriends.map(share => share.shared_with);
                        
                        // Filter out already shared friends
                        const availableFriends = friends.filter(friend => 
                          !alreadySharedIds.includes(friend.friend_id)
                        );
                        
                        if (availableFriends.length === 0) {
                          return (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('assignments.detail.shareModal.noAvailableFriends')}
                              </p>
                            </div>
                          );
                        }
                        
                        return availableFriends.map((friend) => (
                          <label key={friend.friend_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                            <input
                              type="checkbox"
                              checked={selectedFriends.includes(friend.friend_id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFriends([...selectedFriends, friend.friend_id]);
                                } else {
                                  setSelectedFriends(selectedFriends.filter(id => id !== friend.friend_id));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {friend.friend_profile?.full_name || friend.friend_profile?.nickname || 'Unknown'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {friend.friend_profile?.nickname}
                                </p>
                              </div>
                            </div>
                          </label>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors"
                  >
                    {t('assignments.detail.shareModal.cancelButton')}
                  </button>
                  <button
                    onClick={handleShareAssignment}
                    disabled={selectedFriends.length === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                  >
                    {t('assignments.detail.shareModal.shareButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Update Modal */}
        {showProgressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('assignments.detail.progressModal.title')}
                  </h3>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('assignments.detail.progressModal.progressLabel')}: {progressPercentage}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressPercentage}
                      onChange={(e) => setProgressPercentage(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('assignments.detail.progressModal.statusLabel')}
                    </label>
                    <select
                      value={progressStatus}
                      onChange={(e) => setProgressStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="pending">{t('assignments.detail.progressModal.pending')}</option>
                      <option value="in_progress">{t('assignments.detail.progressModal.inProgress')}</option>
                      <option value="completed">{t('assignments.detail.progressModal.completed')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('assignments.detail.progressModal.notesLabel')}
                    </label>
                    <textarea
                      value={progressNotes}
                      onChange={(e) => setProgressNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('assignments.detail.progressModal.notesPlaceholder')}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors"
                  >
                    {t('assignments.detail.progressModal.cancelButton')}
                  </button>
                  <button
                    onClick={handleUpdateProgress}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    {t('assignments.detail.progressModal.updateButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress View Modal */}
        {showProgressViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('assignments.detail.progressViewModal.title')}
                  </h3>
                  <button
                    onClick={() => setShowProgressViewModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {assignmentProgress.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">{t('assignments.detail.progressViewModal.noProgress')}</p>
                    </div>
                  ) : (
                    assignmentProgress.map((progress) => (
                      <div key={progress.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {progress.user_profile?.full_name || progress.user_profile?.nickname || 'Unknown'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {progress.user_profile?.nickname}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            progress.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            progress.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {progress.status === 'completed' ? t('assignments.detail.progressModal.completed') :
                             progress.status === 'in_progress' ? t('assignments.detail.progressModal.inProgress') : t('assignments.detail.progressModal.pending')}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>{t('assignments.detail.progressViewModal.progressLabel')}</span>
                            <span>{progress.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progress.progress_percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {progress.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>{t('assignments.detail.progressViewModal.memoLabel')}:</strong> {progress.notes}
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {t('assignments.detail.progressViewModal.lastUpdated')}: {new Date(progress.updated_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
