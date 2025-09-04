'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    // 모든 네비게이션 메뉴 제거 - 사이드바로 대체
  ];

  type AuthItem = {
    href?: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void | Promise<void>;
  };

  const authItems: AuthItem[] = user ? [
    { 
      href: '#', 
      label: user.user_metadata?.name || user.email || t('common.user'), 
      icon: UserPlus,
      onClick: () => {} // 사용자 프로필 드롭다운을 위한 플레이스홀더
    },
    { 
      href: '#', 
      label: t('common.logout'), 
      icon: LogIn,
      onClick: async () => {
        try {
          await signOut();
        } catch (error) {
          console.error(t('common.logoutError'), error);
        }
      }
    }
  ] : [
    { href: '/auth/login', label: t('navigation.login'), icon: LogIn },
  ];

  // 테마별 스타일 클래스
  const getThemeClasses = () => {
    switch (theme) {
      case 'white':
        return 'bg-white border-gray-200 text-gray-900';
      case 'black':
        return 'bg-gray-800 border-gray-600 text-white';
      case 'pink':
        return 'bg-pink-50 border-pink-200 text-pink-900';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  const getHoverClasses = () => {
    switch (theme) {
      case 'white':
        return 'hover:bg-gray-100 hover:text-gray-900';
      case 'black':
        return 'hover:bg-gray-700 hover:text-white';
      case 'pink':
        return 'hover:bg-pink-100 hover:text-pink-900';
      default:
        return 'hover:bg-gray-100 hover:text-gray-900';
    }
  };

  const getActiveClasses = () => {
    switch (theme) {
      case 'white':
        return 'bg-blue-100 text-blue-700';
      case 'black':
        return 'bg-gray-600 text-white';
      case 'pink':
        return 'bg-pink-200 text-pink-800';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getTextClasses = () => {
    switch (theme) {
      case 'white':
        return 'text-gray-600';
      case 'black':
        return 'text-gray-300';
      case 'pink':
        return 'text-pink-700';
      default:
        return 'text-gray-600';
    }
  };


  return (
    <>
      <nav className={`border-b transition-all duration-300 ${getThemeClasses()} relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 focus:outline-none">
                <Calendar className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold">
                  {t('common.schedule')}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        pathname === item.href
                          ? getActiveClasses()
                          : `${getTextClasses()} ${getHoverClasses()}`
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button - 제거됨 */}
            {/* <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-md transition-all duration-200 hover:scale-105 mobile-touch-target ${getTextClasses()}`}
                aria-label={t('common.openMenu')}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div> */}

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <div className="hidden md:flex items-center space-x-2">
                {authItems.map((item) => {
                  const Icon = item.icon;
                  if (item.onClick) {
                    return (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${getHoverClasses()}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href || '#'}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${getHoverClasses()}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu - 제거됨 */}
          {/* {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 shadow-lg">
              <div className="px-4 py-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 mobile-touch-target ${
                        pathname === item.href
                          ? getActiveClasses()
                          : `${getTextClasses()} ${getHoverClasses()}`
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  {authItems.map((item) => {
                    const Icon = item.icon;
                    if (item.onClick) {
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            item.onClick?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 mobile-touch-target ${getHoverClasses()}`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href || '#'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 mobile-touch-target ${getHoverClasses()}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )} */}
        </div>
      </nav>
      
    </>
  );
}
