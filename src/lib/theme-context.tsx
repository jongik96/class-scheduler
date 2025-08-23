'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('white');

  useEffect(() => {
    // 로컬스토리지에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['white', 'black', 'pink'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // 테마 변경 시 로컬스토리지에 저장하고 body 클래스 업데이트
    localStorage.setItem('theme', theme);
    
    // 기존 테마 클래스 제거
    document.body.classList.remove('theme-white', 'theme-black', 'theme-pink');
    
    // 새 테마 클래스 추가
    document.body.classList.add(`theme-${theme}`);
    
    // CSS 변수도 직접 설정하여 즉시 반영
    const root = document.documentElement;
    
    if (theme === 'white') {
      // White 테마 - 밝고 깔끔한 느낌
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
      root.style.setProperty('--border-secondary', '#cbd5e1');
      root.style.setProperty('--accent-color', '#3b82f6');
      root.style.setProperty('--accent-hover', '#2563eb');
      root.style.setProperty('--success-color', '#10b981');
      root.style.setProperty('--warning-color', '#f59e0b');
      root.style.setProperty('--error-color', '#ef4444');
    } else if (theme === 'black') {
      // Black 테마 - 어두운 색상으로 모든 구성요소 통일
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#e2e8f0');
      root.style.setProperty('--text-tertiary', '#cbd5e1');
      root.style.setProperty('--border-color', '#475569');
      root.style.setProperty('--border-secondary', '#64748b');
      root.style.setProperty('--accent-color', '#60a5fa');
      root.style.setProperty('--accent-hover', '#3b82f6');
      root.style.setProperty('--success-color', '#34d399');
      root.style.setProperty('--warning-color', '#fbbf24');
      root.style.setProperty('--error-color', '#f87171');
    } else if (theme === 'pink') {
      // Pink 테마 - 핑크 계열 색상으로 모든 구성요소 통일
      root.style.setProperty('--bg-primary', '#fdf2f8');
      root.style.setProperty('--bg-secondary', '#fce7f3');
      root.style.setProperty('--bg-tertiary', '#fbcfe8');
      root.style.setProperty('--text-primary', '#831843');
      root.style.setProperty('--text-secondary', '#be185d');
      root.style.setProperty('--text-tertiary', '#e91e63');
      root.style.setProperty('--border-color', '#f9a8d4');
      root.style.setProperty('--border-secondary', '#f472b6');
      root.style.setProperty('--accent-color', '#ec4899');
      root.style.setProperty('--accent-hover', '#db2777');
      root.style.setProperty('--success-color', '#f472b6');
      root.style.setProperty('--warning-color', '#f9a8d4');
      root.style.setProperty('--error-color', '#e91e63');
    }
    
    // 배경색과 텍스트 색상을 즉시 적용
    document.body.style.backgroundColor = getComputedStyle(root).getPropertyValue('--bg-primary');
    document.body.style.color = getComputedStyle(root).getPropertyValue('--text-primary');
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
