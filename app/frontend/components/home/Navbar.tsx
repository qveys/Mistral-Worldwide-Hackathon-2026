'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Github, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTheme } from '@/lib/ThemeContext';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const t = useTranslations('nav');
  const tDoc = useTranslations('doc');
  const { isLoggedIn, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const linkClass = "px-3 sm:px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300 text-sm";
  const docLinkClass = "px-3 sm:px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-2 border-slate-300 dark:border-zinc-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-300 text-sm";
  const navLinks = (
    <>
      <Link href="/dashboard" className={linkClass} onClick={() => setMobileMenuOpen(false)}>{t('console')}</Link>
      <Link href="/dashboard/roadmaps/new" className={`${linkClass} whitespace-nowrap`} onClick={() => setMobileMenuOpen(false)}>{t('createRoadmap')}</Link>
      <Link href="/documentation" className={docLinkClass} onClick={() => setMobileMenuOpen(false)}>{tDoc('documentation')}</Link>
    </>
  );
  const mobileNavLinks = (
    <>
      <Link href="/dashboard" className="block w-full px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('console')}</Link>
      <Link href="/dashboard/roadmaps/new" className="block w-full px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('createRoadmap')}</Link>
      <Link href="/documentation" className="block w-full px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-2 border-blue-200 dark:border-blue-800" onClick={() => setMobileMenuOpen(false)}>{tDoc('documentation')}</Link>
    </>
  );

  const iconButtons = (
    <>
      <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-zinc-600 mx-1" />
      <button type="button" onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300" aria-label={isDarkMode ? t('themeLight') : t('themeDark')}>
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <LanguageSwitcher className="shrink-0" />
      <a href="https://github.com/qveys/Mistral-Worldwide-Hackathon-2026" target="_blank" rel="noopener noreferrer" aria-label={t('github')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
        <Github size={20} />
      </a>
      {isLoggedIn && (
        <button type="button" onClick={handleLogout} aria-label={t('logout')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300">
          <LogOut size={20} />
        </button>
      )}
    </>
  );

  return (
    <nav className="pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 md:px-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
      <Link href="/" className="flex items-center gap-2 font-black text-lg sm:text-xl tracking-tighter italic text-slate-900 dark:text-white shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
          <Image src="/logo.png" alt="EchoMaps" width={32} height={32} className="object-contain w-full h-full" />
        </div>
        <span className="hidden sm:inline">ECHOMAPS</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-zinc-400 font-medium">
        {navLinks}
        {iconButtons}
      </div>

      {/* Mobile: icons + hamburger */}
      <div className="flex lg:hidden items-center gap-1">
        {iconButtons}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300 ml-2"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={cn(
        "absolute top-full left-0 right-0 mt-2 mx-0 sm:mx-4 lg:hidden overflow-hidden transition-all duration-300 z-50",
        mobileMenuOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"
      )}>
        <div className="flex flex-col gap-1 p-4 mx-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 shadow-xl">
          {mobileNavLinks}
        </div>
      </div>
    </nav>
  );
}
