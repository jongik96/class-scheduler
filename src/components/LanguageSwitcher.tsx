'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { id: 'ko', name: '한국어', flag: '🇰🇷' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
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
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {languages.find(lang => lang.id === language)?.flag} {languages.find(lang => lang.id === language)?.name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg border z-50 ${getDropdownClasses()} mobile-dropdown`}>
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${getDropdownItemClasses(language === lang.id)}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
