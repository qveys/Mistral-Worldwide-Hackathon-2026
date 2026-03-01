'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center rounded-full bg-slate-200/90 dark:bg-zinc-800/90 backdrop-blur-md border border-slate-300/50 dark:border-zinc-700/50 p-1 shadow-lg"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          'p-2 rounded-full transition-all duration-200',
          !isDark
            ? 'bg-white text-amber-500 shadow-md dark:bg-amber-500/20'
            : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
        )}
        aria-label="Light mode"
        aria-pressed={!isDark}
      >
        <Sun size={18} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          'p-2 rounded-full transition-all duration-200',
          isDark
            ? 'bg-zinc-800 text-violet-400 shadow-md dark:bg-violet-500/20'
            : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
        )}
        aria-label="Dark mode"
        aria-pressed={isDark}
      >
        <Moon size={18} strokeWidth={2} />
      </button>
    </div>
  );
}
