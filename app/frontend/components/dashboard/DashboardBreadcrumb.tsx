'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

const SEGMENT_KEYS = {
  dashboard: 'console',
  roadmaps: 'roadmaps',
  activity: 'activity',
  timeline: 'timeline',
  settings: 'settings',
  new: 'newRoadmap',
} as const;

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: segment in SEGMENT_KEYS
        ? t(SEGMENT_KEYS[segment as keyof typeof SEGMENT_KEYS])
        : segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + arr.slice(0, i + 1).join('/'),
      isLast: i === arr.length - 1,
    }));

  if (segments.length === 0) return null;

  return (
    <nav
      className={cn(
        "flex items-center gap-1 py-4 px-6 lg:px-8",
        isDarkMode ? "text-zinc-500" : "text-slate-500"
      )}
      aria-label={tCommon('breadcrumbAria')}
    >
      {segments.map((seg, i) => (
        <React.Fragment key={seg.href}>
          {i > 0 && (
            <ChevronRight
              size={12}
              strokeWidth={2.5}
              className={cn("shrink-0 opacity-50", isDarkMode ? "text-zinc-600" : "text-slate-400")}
            />
          )}
          {seg.isLast ? (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-colors",
                isDarkMode
                  ? "bg-zinc-800/80 text-white border border-zinc-700/50"
                  : "bg-slate-200/80 text-slate-900 border border-slate-300/80"
              )}
            >
              {i === 0 && seg.href === '/dashboard' ? <Home size={12} className="opacity-80" /> : null}
              {seg.label}
            </span>
          ) : (
            <Link
              href={seg.href}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-[0.12em] transition-all duration-200",
                isDarkMode
                  ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-300"
              )}
            >
              {i === 0 && seg.href === '/dashboard' ? <Home size={12} className="opacity-70" /> : null}
              {seg.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
