'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import QRCode from 'react-qr-code';
import { ArrowLeft, Share2, Copy } from 'lucide-react';
import Link from 'next/link';

export default function QRCodePage() {
  const params = useParams();
  const { t } = useLanguage();
  const inviteCode = params.code as string;
  
  const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('friends.inviteTitle'),
          text: t('friends.inviteMessage'),
          url: inviteUrl,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link 
            href="/schedule/view"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>시간표 보기로 돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            친구 초대 QR 코드
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            이 QR 코드를 친구에게 보여주거나 초대 링크를 공유하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: QR 코드 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              QR 코드
            </h2>
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg border mb-6">
                <QRCode value={inviteUrl} size={300} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이 QR 코드를 스캔하여 친구를 초대하세요
              </p>
            </div>
          </div>

          {/* 오른쪽: 초대 링크 및 공유 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              초대 링크
            </h2>
            
            <div className="space-y-6">
              {/* 초대 링크 표시 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  초대 링크
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border">
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                    {inviteUrl}
                  </p>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                >
                  <Copy size={16} />
                  <span>{copied ? '복사됨!' : '링크 복사'}</span>
                </button>
                
                <button
                  onClick={shareInvite}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 size={16} />
                  <span>공유하기</span>
                </button>
              </div>

              {/* 안내 메시지 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  친구 초대 방법
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• QR 코드를 친구에게 보여주세요</li>
                  <li>• 초대 링크를 복사하여 메시지로 전송하세요</li>
                  <li>• 공유하기 버튼을 사용하여 직접 공유하세요</li>
                </ul>
              </div>

              {/* 만료 정보 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t('friends.inviteExpires')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
