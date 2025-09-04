'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { createFriendInvite } from '@/lib/friends-api';
import QRCode from 'react-qr-code';
import { Copy, Share2, QrCode, X } from 'lucide-react';

interface FriendInviteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FriendInvite({ isOpen, onClose }: FriendInviteProps) {
  const { t } = useLanguage();
  const [inviteData, setInviteData] = useState<{ invite_code: string; invite_url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !inviteData) {
      generateInvite();
    }
  }, [isOpen, inviteData]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('friends.inviteFriend')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('friends.generatingInvite')}
            </p>
          </div>
        ) : inviteData ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('friends.inviteDescription')}
              </p>
              
              {showQR ? (
                <div className="bg-white p-4 rounded-lg border">
                  <QRCode value={inviteData.invite_url} size={300} />
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border">
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                    {inviteData.invite_url}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowQR(!showQR)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showQR
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                <QrCode size={16} />
                <span>{showQR ? t('friends.showLink') : t('friends.showQR')}</span>
              </button>
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
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              {t('friends.failedToGenerate')}
            </p>
            <button
              onClick={generateInvite}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('friends.retry')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
