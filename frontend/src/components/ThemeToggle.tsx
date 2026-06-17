'use client';

import { useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'bright' | 'standard';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeType>('bright');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adgravity_theme') as ThemeType;
    if (saved && ['light', 'dark', 'bright', 'standard'].includes(saved)) {
      setTheme(saved);
      document.documentElement.className = `theme-${saved}`;
    } else {
      setTheme('bright');
      document.documentElement.className = 'theme-bright';
    }
  }, []);

  const selectTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('adgravity_theme', newTheme);
    document.documentElement.className = `theme-${newTheme}`;
    setIsOpen(false);
  };

  const themeMeta = {
    light: { label: 'Light', icon: '☀️' },
    dark: { label: 'Dark', icon: '🌙' },
    bright: { label: 'Google Bright', icon: '🌈' },
    standard: { label: 'Standard Dark', icon: '💻' }
  };

  return (
    <div className="relative z-50">
      {isOpen && (
        <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card-bg border border-border-custom text-text-primary text-xs font-bold transition-all hover:bg-white/5 hover:scale-[1.02] cursor-pointer shadow-sm select-none"
      >
        <span>{themeMeta[theme].icon}</span>
        <span className="hidden sm:inline">{themeMeta[theme].label}</span>
        <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+6px)] w-40 bg-card-bg border border-border-custom rounded-xl shadow-xl overflow-hidden py-1 animate-fade-in flex flex-col">
          {Object.entries(themeMeta).map(([key, value]) => (
            <button
              key={key}
              onClick={() => selectTheme(key as ThemeType)}
              className={`w-full px-4 py-2.5 text-left text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                theme === key 
                  ? 'bg-accent-custom/10 text-accent-custom font-extrabold' 
                  : 'text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{value.icon}</span>
              <span>{value.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
