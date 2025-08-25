'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Eye, CheckSquare, Calendar, Users } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/AuthGuard';

export default function HomePage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, profileComplete, loading } = useAuth();
  const router = useRouter();

  // 로그인된 사용자는 View Schedule Page로 리다이렉트
  useEffect(() => {
    if (!loading && user && profileComplete) {
      router.push('/schedule/view');
    }
  }, [user, profileComplete, loading, router]);

  // 테마별 히어로 섹션 스타일
  const getHeroStyles = () => {
    switch (theme) {
      case 'white':
        return {
          gradient: 'from-blue-50 to-indigo-100',
          title: 'text-gray-900',
          subtitle: 'text-blue-600',
          description: 'text-gray-600',
          primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButton: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
        };
      case 'black':
        return {
          gradient: 'from-gray-800 to-gray-900',
          title: 'text-white',
          subtitle: 'text-blue-400',
          description: 'text-gray-300',
          primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButton: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
        };
      case 'pink':
        return {
          gradient: 'from-pink-50 to-pink-100',
          title: 'text-pink-900',
          subtitle: 'text-pink-600',
          description: 'text-pink-700',
          primaryButton: 'bg-pink-600 hover:bg-pink-700 text-white',
          secondaryButton: 'bg-white hover:bg-pink-50 text-pink-700 border-pink-300'
        };
      default:
        return {
          gradient: 'from-blue-50 to-indigo-100',
          title: 'text-gray-900',
          subtitle: 'text-blue-600',
          description: 'text-gray-600',
          primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondaryButton: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
        };
    }
  };

  const heroStyles = getHeroStyles();

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className={`bg-gradient-to-br ${heroStyles.gradient} py-12 sm:py-16 md:py-20 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold ${heroStyles.title} mb-4 sm:mb-6`}>
              <span className="block">{t('home.title')}</span>
              <span className={`block ${heroStyles.subtitle}`}>{t('home.subtitle')}</span>
            </h1>
            <p className={`text-lg sm:text-xl ${heroStyles.description} mb-6 sm:mb-8 max-w-3xl mx-auto px-4`}>
              {t('home.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mobile-button-group">
              <Link
                href="/schedule/add"
                className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-all duration-200 hover:scale-105 ${heroStyles.primaryButton} w-full sm:w-auto mobile-touch-target`}
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('home.addFirstCourse')}
              </Link>
              <Link
                href="/schedule/view"
                className={`inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-all duration-200 hover:scale-105 ${heroStyles.secondaryButton} w-full sm:w-auto mobile-touch-target`}
              >
                <Eye className="w-5 h-5 mr-2" />
                {t('home.viewSchedule')}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.features.title')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                {t('home.features.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mobile-grid-1 sm:mobile-grid-2 lg:mobile-grid-1">
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700">
                <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.features.schedule.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.features.schedule.description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700">
                <Plus className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.features.addCourse.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.features.addCourse.description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700">
                <CheckSquare className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.features.assignments.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.features.assignments.description')}
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700">
                <Users className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.features.sharing.title')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.features.sharing.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.quickActions.title')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                {t('home.quickActions.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mobile-grid-1 tablet-grid-2 lg:grid-cols-3">
              <Link
                href="/schedule/add"
                className="group p-6 sm:p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
              >
                <Plus className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.quickActions.addCourse')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.quickActions.addCourseDesc')}
                </p>
              </Link>
              
              <Link
                href="/schedule/view"
                className="group p-6 sm:p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
              >
                <Eye className="w-12 h-12 text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.quickActions.viewSchedule')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.quickActions.viewScheduleDesc')}
                </p>
              </Link>
              
              <Link
                href="/assignment/list"
                className="group p-6 sm:p-8 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-600 md:col-span-1 lg:col-span-1"
              >
                <CheckSquare className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('home.quickActions.checkAssignments')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {t('home.quickActions.checkAssignmentsDesc')}
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-3" />
              <span className="text-xl sm:text-2xl font-bold">Smart Scheduler</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-4 px-4">
              {t('home.footer.description')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <span>{t('home.footer.copyright')}</span>
              <span className="hidden sm:inline">•</span>
              <span>{t('home.footer.privacy')}</span>
              <span className="hidden sm:inline">•</span>
              <span>{t('home.footer.terms')}</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
