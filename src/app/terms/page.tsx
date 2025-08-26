'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Shield, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TermsOfServicePage() {
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
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('terms.title')}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('terms.lastUpdated')}: {t('terms.lastUpdatedDate')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                {t('terms.introduction.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.introduction.description')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('terms.introduction.agreement')}
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                {t('terms.service.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.service.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.service.features.courseManagement')}</li>
                <li>{t('terms.service.features.assignmentTracking')}</li>
                <li>{t('terms.service.features.schedulePlanning')}</li>
                <li>{t('terms.service.features.friendConnections')}</li>
                <li>{t('terms.service.features.multilingual')}</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                {t('terms.accounts.title')}
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('terms.accounts.registration.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.accounts.registration.requirements')}</li>
                <li>{t('terms.accounts.registration.accuracy')}</li>
                <li>{t('terms.accounts.registration.security')}</li>
                <li>{t('terms.accounts.registration.oneAccount')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('terms.accounts.responsibilities.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.accounts.responsibilities.password')}</li>
                <li>{t('terms.accounts.responsibilities.activities')}</li>
                <li>{t('terms.accounts.responsibilities.notification')}</li>
                <li>{t('terms.accounts.responsibilities.compliance')}</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                {t('terms.acceptableUse.title')}
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('terms.acceptableUse.allowed.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.acceptableUse.allowed.personal')}</li>
                <li>{t('terms.acceptableUse.allowed.educational')}</li>
                <li>{t('terms.acceptableUse.allowed.legal')}</li>
                <li>{t('terms.acceptableUse.allowed.respectful')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {t('terms.acceptableUse.prohibited.title')}
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.acceptableUse.prohibited.illegal')}</li>
                <li>{t('terms.acceptableUse.prohibited.harmful')}</li>
                <li>{t('terms.acceptableUse.prohibited.spam')}</li>
                <li>{t('terms.acceptableUse.prohibited.unauthorized')}</li>
                <li>{t('terms.acceptableUse.prohibited.privacy')}</li>
                <li>{t('terms.acceptableUse.prohibited.security')}</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.intellectualProperty.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.intellectualProperty.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.intellectualProperty.ownership')}</li>
                <li>{t('terms.intellectualProperty.license')}</li>
                <li>{t('terms.intellectualProperty.userContent')}</li>
                <li>{t('terms.intellectualProperty.feedback')}</li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.privacy.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.privacy.description')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                  {t('terms.privacy.link')}
                </Link>
              </p>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.availability.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.availability.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.availability.maintenance')}</li>
                <li>{t('terms.availability.updates')}</li>
                <li>{t('terms.availability.technical')}</li>
                <li>{t('terms.availability.force')}</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                {t('terms.liability.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.liability.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.liability.exclusions')}</li>
                <li>{t('terms.liability.maximum')}</li>
                <li>{t('terms.liability.essential')}</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.termination.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.termination.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.termination.user')}</li>
                <li>{t('terms.termination.service')}</li>
                <li>{t('terms.termination.effects')}</li>
                <li>{t('terms.termination.survival')}</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.governingLaw.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.governingLaw.description')}
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.changes.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.changes.description')}
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>{t('terms.changes.notification')}</li>
                <li>{t('terms.changes.continued')}</li>
                <li>{t('terms.changes.material')}</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('terms.contact.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('terms.contact.description')}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>{t('terms.contact.email')}:</strong> pji3503@gmail.com
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('terms.footer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
