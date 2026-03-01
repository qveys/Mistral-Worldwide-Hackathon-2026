'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Github, Sun, Moon, LogOut } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';

export function Navbar() {
  const t = useTranslations('nav');
  const tDoc = useTranslations('doc');
  const { isLoggedIn, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="pt-12 pb-8 px-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter italic text-slate-900 dark:text-white">
        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
          <Image src="/logo.png" alt="EchoMaps" width={32} height={32} className="object-contain" />
        </div>
        ECHOMAPS
      </Link>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-zinc-400">
        <Link href="/dashboard" className="px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300">{t('console')}</Link>
        <Link href="/dashboard/roadmaps/new" className="px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300">{t('createRoadmap')}</Link>
        <Link href="/documentation" className="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-2 border-slate-300 dark:border-zinc-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-300">{tDoc('documentation')}</Link>
        <div className="h-4 w-px bg-slate-300 dark:bg-zinc-600 mx-2" />
        <button type="button" onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300" aria-label={isDarkMode ? t('themeLight') : t('themeDark')}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <LanguageSwitcher className="shrink-0" />
        <a href="https://github.com/qveys/Mistral-Worldwide-Hackathon-2026" target="_blank" rel="noopener noreferrer" aria-label={t('github')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
          <Github size={20} />
        </a>
        {isLoggedIn && (
            <button
                type="button"
                onClick={handleLogout}
                aria-label={t('logout')}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300"
            >
                <LogOut size={20} />
            </button>
        )}
      </div>
    </nav>
  );
}
