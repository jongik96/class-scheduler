'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import { Palette, ChevronDown } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { 
      id: 'white', 
      name: 'White', 
      bg: 'bg-white', 
      text: 'text-gray-900',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50'
    },
    { 
      id: 'black', 
      name: 'Black', 
      bg: 'bg-gray-800', 
      text: 'text-white',
      border: 'border-gray-600',
      hover: 'hover:bg-gray-700'
    },
    { 
      id: 'pink', 
      name: 'Pink', 
      bg: 'bg-pink-50', 
      text: 'text-pink-900',
      border: 'border-pink-200',
      hover: 'hover:bg-pink-100'
    },
  ] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 테마별 버튼 스타일
  const getButtonClasses = () => {
    switch (theme) {
      case 'white':
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
      case 'black':
        return 'text-gray-300 hover:text-white hover:bg-gray-700';
      case 'pink':
        return 'text-pink-700 hover:text-pink-900 hover:bg-pink-100';
      default:
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
    }
  };

  // 테마별 드롭다운 스타일
  const getDropdownClasses = () => {
    switch (theme) {
      case 'white':
        return 'bg-white border-gray-200';
      case 'black':
        return 'bg-gray-800 border-gray-600';
      case 'pink':
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  // 테마별 드롭다운 아이템 스타일
  const getDropdownItemClasses = (isSelected: boolean) => {
    if (isSelected) {
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
    } else {
      switch (theme) {
        case 'white':
          return 'text-gray-700 hover:bg-gray-100';
        case 'black':
          return 'text-gray-300 hover:bg-gray-700';
        case 'pink':
          return 'text-pink-700 hover:bg-pink-100';
        default:
          return 'text-gray-700 hover:bg-gray-100';
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${getButtonClasses()}`}
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{t('common.theme')}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg border z-50 ${getDropdownClasses()}`}>
          <div className="py-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${getDropdownItemClasses(theme === t.id)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${t.bg} ${t.border}`} />
                  <span>{t.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
