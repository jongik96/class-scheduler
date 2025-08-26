'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { getFriends, createFriendInvite, Friend } from '@/lib/friends-api';
import QRCode from 'react-qr-code';
import { Copy, Share2, QrCode, Users, UserPlus } from 'lucide-react';

export default function FriendsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [inviteData, setInviteData] = useState<{ invite_code: string; invite_url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  const loadFriends = async () => {
    try {
      const friendsList = await getFriends();
      setFriends(friendsList);
    } catch (error) {
      console.error('Failed to load friends:', error);
    }
  };

  const generateInvite = async () => {
    setLoading(true);
    try {
      const data = await createFriendInvite();
      if (data) {
        setInviteData(data);
      }
    } catch (error) {
      console.error('Failed to generate invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareInvite = async () => {
    if (navigator.share && inviteData) {
      try {
        await navigator.share({
          title: t('friends.inviteTitle'),
          text: t('friends.inviteMessage'),
          url: inviteData.invite_url,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      copyToClipboard(inviteData?.invite_url || '');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('common.loginRequired')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('navigation.friends')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('friends.inviteDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 친구 목록 및 초대 링크 생성 */}
          <div className="space-y-6">
            {/* 초대 링크 생성 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('friends.inviteFriend')}
              </h2>
              
              {!inviteData ? (
                <button
                  onClick={generateInvite}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('friends.generatingInvite')}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>{t('friends.inviteFriend')}</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border">
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                      {inviteData.invite_url}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(inviteData.invite_url)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Copy size={16} />
                      <span>{copied ? t('friends.copied') : t('friends.copyLink')}</span>
                    </button>
                    
                    <button
                      onClick={shareInvite}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>{t('friends.share')}</span>
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {t('friends.inviteExpires')}
                  </div>
                </div>
              )}
            </div>

            {/* 친구 목록 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('navigation.friends')}
              </h2>
              
              {friends.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    아직 친구가 없습니다. 초대 링크를 생성하여 친구를 초대해보세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {friend.friend_profile?.nickname?.[0] || friend.friend_id?.[0] || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {friend.friend_profile?.nickname || friend.friend_id}
                        </p>
                        {friend.friend_profile?.major && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {friend.friend_profile.major} {friend.friend_profile.grade}학년
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: QR 코드 표시 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              QR 코드
            </h2>
            
            {inviteData ? (
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg border mb-4">
                  <QRCode value={inviteData.invite_url} size={250} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  이 QR 코드를 스캔하여 친구를 초대하세요
                </p>
                <button
                  onClick={() => window.open(`/friends/qr/${inviteData.invite_code}`, '_blank')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Friends
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  초대 링크를 생성하면 QR 코드가 여기에 표시됩니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
