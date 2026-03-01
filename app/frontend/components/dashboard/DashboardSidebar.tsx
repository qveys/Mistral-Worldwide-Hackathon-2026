'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  History,
  Calendar,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  Command,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/navigation';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function DashboardSidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useDashboardTheme();
  const t = useTranslations('nav');

  const navItems = [
    { id: 'dash', labelKey: 'console' as const, icon: LayoutDashboard, href: '/dashboard' },
    { id: 'proj', labelKey: 'roadmaps' as const, icon: Target, href: '/dashboard/roadmaps' },
    { id: 'hist', labelKey: 'activity' as const, icon: History, href: '/dashboard/activity' },
    { id: 'cal', labelKey: 'timeline' as const, icon: Calendar, href: '/dashboard/timeline' },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#09090b] p-4 flex flex-col gap-10 z-30 transition-all duration-500",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn("flex items-center gap-3 px-2", isCollapsed ? "justify-center" : "justify-between")}>
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center text-white dark:text-black flex-shrink-0">
            <Command size={18} />
          </div>
          {!isCollapsed && <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-base uppercase">EchoMaps</span>}
        </Link>
        <button onClick={onToggle} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors">
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={cn(
                "w-full flex items-center gap-4 px-3 py-4 rounded-xl transition-all text-xs font-medium",
                isActive 
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-400")} />
              {!isCollapsed && <span>{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={isDarkMode ? t('themeLight') : t('themeDark')}
          className={cn(
            "w-full flex items-center gap-4 px-3 py-4 rounded-xl transition-all text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
            isCollapsed && "justify-center px-0"
          )}
        >
          {isDarkMode ? <Sun size={22} className="text-amber-500" /> : <Moon size={22} className="text-indigo-600" />}
          {!isCollapsed && <span>{isDarkMode ? t('themeLight') : t('themeDark')}</span>}
        </button>

        {!isCollapsed && (
          <div className="px-3 py-2">
            <LanguageSwitcher variant="compact" />
          </div>
        )}

        <Link
          href="/dashboard/settings"
          className={cn(
            "w-full flex items-center gap-4 px-3 py-4 rounded-xl transition-all text-xs font-medium",
            pathname === '/dashboard/settings'
              ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Settings size={22} />
          {!isCollapsed && <span>{t('settings')}</span>}
        </Link>

        <Link href="/" className={cn("w-full flex items-center gap-4 px-3 py-4 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all", isCollapsed && "justify-center px-0")}>
          <LogOut size={22} />
          {!isCollapsed && <span>{t('exit')}</span>}
        </Link>
      </div>
    </aside>
  );
}
