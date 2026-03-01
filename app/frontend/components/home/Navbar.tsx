'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Github, LogOut } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useAuth } from '@/lib/AuthContext';

export function Navbar() {
  const t = useTranslations('nav');
  const tDoc = useTranslations('doc');
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="pt-12 pb-8 px-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter italic">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45 opacity-90" />
        </div>
        ECHOMAPS
      </Link>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/dashboard" className="px-4 py-2 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all duration-300">{t('console')}</Link>
        <Link href="/documentation" className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold border-2 border-slate-300 hover:bg-blue-100 hover:border-blue-200 transition-all duration-300">{tDoc('documentation')}</Link>
        <div className="h-4 w-[1px] bg-slate-300 mx-2" />
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
        <LanguageSwitcher className="shrink-0" />
        <a href="https://github.com/qveys/Mistral-Worldwide-Hackathon-2026" target="_blank" rel="noopener noreferrer" aria-label={t('github')} className="p-2 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all duration-300">
          <Github size={20} />
        </a>
      </div>
    </nav>
  );
}
