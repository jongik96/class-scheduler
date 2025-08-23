'use client';

import { useState } from 'react';
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
      label: '시간표',
      icon: Calendar,
      description: '시간표 보기'
    },
    {
      id: 'assignments' as SidebarMenu,
      label: '과제',
      icon: CheckSquare,
      description: '과제 목록'
    },
    {
      id: 'courses' as SidebarMenu,
      label: '수업',
      icon: BookOpen,
      description: '수업 목록'
    },
    {
      id: 'friends' as SidebarMenu,
      label: '친구',
      icon: Users,
      description: '친구 목록'
    },
    {
      id: 'settings' as SidebarMenu,
      label: '설정',
      icon: Settings,
      description: '개인정보 및 설정'
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
    <div className={`relative border-r transition-all duration-300 ${getThemeClasses()}`}>
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className={`absolute -right-3 top-6 z-10 p-1 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-200 ${
          isCollapsed ? 'rotate-180' : ''
        }`}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sidebar Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4">
          {/* Logo/Title */}
          <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('common.schedule')}
              </h2>
            )}
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? getActiveClasses()
                      : `${getHoverClasses()} text-gray-600 dark:text-gray-300`
                  }`}
                  title={isCollapsed ? item.description : undefined}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
