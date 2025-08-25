'use client';

import { 
  Calendar, 
  CheckSquare, 
  BookOpen, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';

export type SidebarMenu = 'schedule' | 'assignments' | 'courses' | 'friends' | 'settings';

interface SidebarProps {
  selectedMenu: SidebarMenu;
  onMenuChange: (menu: SidebarMenu) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ 
  selectedMenu, 
  onMenuChange, 
  isCollapsed, 
  onToggleCollapse 
}: SidebarProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const menuItems = [
    {
      id: 'schedule' as SidebarMenu,
      label: t('sidebar.schedule'),
      icon: Calendar,
      description: t('sidebar.scheduleDescription')
    },
    {
      id: 'assignments' as SidebarMenu,
      label: t('sidebar.assignments'),
      icon: CheckSquare,
      description: t('sidebar.assignmentsDescription')
    },
    {
      id: 'courses' as SidebarMenu,
      label: t('sidebar.courses'),
      icon: BookOpen,
      description: t('sidebar.coursesDescription')
    },
    {
      id: 'friends' as SidebarMenu,
      label: t('sidebar.friends'),
      icon: Users,
      description: t('sidebar.friendsDescription')
    },
    {
      id: 'settings' as SidebarMenu,
      label: t('sidebar.settings'),
      icon: Settings,
      description: t('sidebar.settingsDescription')
    }
  ];

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
        return 'bg-blue-100 text-blue-700 border-r-2 border-blue-500';
      case 'black':
        return 'bg-gray-600 text-white border-r-2 border-blue-400';
      case 'pink':
        return 'bg-pink-200 text-pink-800 border-r-2 border-pink-500';
      default:
        return 'bg-blue-100 text-blue-700 border-r-2 border-blue-500';
    }
  };

  return (
    <div className={`h-screen border-r transition-all duration-300 ${getThemeClasses()} ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${isCollapsed ? 'hidden sm:block' : ''} relative`}>
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className={`absolute -right-3 top-6 z-10 p-1 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 mobile-touch-target ${
          isCollapsed ? 'rotate-180' : ''
        } mobile-sidebar-toggle`}
        aria-label={isCollapsed ? '사이드바 확장' : '사이드바 축소'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sidebar Content */}
      <div className="h-full">
        <div className="h-full flex flex-col">
          {/* Logo/Title */}
          <div className={`p-4 border-b border-gray-200 dark:border-gray-600 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {t('common.schedule')}
              </h2>
            )}
            {isCollapsed && (
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 mobile-touch-target ${
                    isActive 
                      ? getActiveClasses()
                      : `${getHoverClasses()} text-gray-600 dark:text-gray-300`
                  }`}
                  title={isCollapsed ? item.description : undefined}
                  aria-label={item.label}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className="truncate min-w-0">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" 
           style={{ display: isCollapsed ? 'none' : 'block' }}
           onClick={onToggleCollapse} />
    </div>
  );
}
