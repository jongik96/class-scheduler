'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Users } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.backToHome')}
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('privacy.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('privacy.lastUpdated')}: {t('privacy.lastUpdatedDate')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-blue-600" />
                {t('privacy.introduction.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.introduction.description')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('privacy.introduction.contact')}
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                {t('privacy.informationCollection.title')}
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('privacy.informationCollection.personalData.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.informationCollection.personalData.email')}</li>
                <li>{t('privacy.informationCollection.personalData.name')}</li>
                <li>{t('privacy.informationCollection.personalData.studentInfo')}</li>
                <li>{t('privacy.informationCollection.personalData.profile')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('privacy.informationCollection.usageData.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.informationCollection.usageData.courses')}</li>
                <li>{t('privacy.informationCollection.usageData.assignments')}</li>
                <li>{t('privacy.informationCollection.usageData.schedule')}</li>
                <li>{t('privacy.informationCollection.usageData.friends')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('privacy.informationCollection.technicalData.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.informationCollection.technicalData.ip')}</li>
                <li>{t('privacy.informationCollection.technicalData.browser')}</li>
                <li>{t('privacy.informationCollection.technicalData.device')}</li>
                <li>{t('privacy.informationCollection.technicalData.cookies')}</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                {t('privacy.usage.title')}
              </h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.usage.provide')}</li>
                <li>{t('privacy.usage.communicate')}</li>
                <li>{t('privacy.usage.improve')}</li>
                <li>{t('privacy.usage.security')}</li>
                <li>{t('privacy.usage.legal')}</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                {t('privacy.sharing.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.sharing.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.sharing.consent')}</li>
                <li>{t('privacy.sharing.service')}</li>
                <li>{t('privacy.sharing.legal')}</li>
                <li>{t('privacy.sharing.business')}</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                {t('privacy.security.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.security.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.security.encryption')}</li>
                <li>{t('privacy.security.access')}</li>
                <li>{t('privacy.security.monitoring')}</li>
                <li>{t('privacy.security.training')}</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.rights.title')}
              </h2>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.rights.access')}</li>
                <li>{t('privacy.rights.correction')}</li>
                <li>{t('privacy.rights.deletion')}</li>
                <li>{t('privacy.rights.portability')}</li>
                <li>{t('privacy.rights.restriction')}</li>
                <li>{t('privacy.rights.objection')}</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.retention.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.retention.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('privacy.retention.account')}</li>
                <li>{t('privacy.retention.inactive')}</li>
                <li>{t('privacy.retention.legal')}</li>
              </ul>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.international.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.international.description')}
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.children.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.children.description')}
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.changes.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.changes.description')}
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('privacy.contact.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('privacy.contact.description')}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{t('privacy.contact.email')}:</strong> privacy@schedule-app.com
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{t('privacy.contact.address')}:</strong> {t('privacy.contact.addressValue')}
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('privacy.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
