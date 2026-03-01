'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Layout, Network, Calendar, Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ExportButton } from '@/components/ui/ExportButton';
import { useTheme } from '@/lib/ThemeContext';

interface ProjectHeaderProps {
  projectId: string;
  roadmapTitle: string;
  viewMode: 'grid' | 'graph' | 'timeline';
  setViewMode: (mode: 'grid' | 'graph' | 'timeline') => void;
  markdown: string;
  roadmapData: any;
}

export function ProjectHeader({ 
  projectId, 
  roadmapTitle, 
  viewMode, 
  setViewMode, 
  markdown, 
  roadmapData 
}: ProjectHeaderProps) {
  const t = useTranslations('nav');
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800/50 px-6 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/roadmaps"
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500 hidden sm:block">
            Roadmap Unit / {projectId.substring(0, 8)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-xl p-1 border border-slate-200 dark:border-zinc-800 mr-4">
            {[
              { id: 'grid', icon: Layout, label: 'Structured View' },
              { id: 'graph', icon: Network, label: 'Neural Graph' },
              { id: 'timeline', icon: Calendar, label: 'Execution Timeline' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                title={mode.label}
                className={cn(
                  "p-2 rounded-lg transition-all relative",
                  viewMode === mode.id
                    ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-lg"
                    : "text-slate-600 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-400"
                )}
              >
                <mode.icon size={16} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-500"
            aria-label={isDarkMode ? t('themeLight') : t('themeDark')}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <ExportButton
            markdown={markdown}
            data={roadmapData}
            filename={roadmapTitle.replace(/\s+/g, '-').toLowerCase()}
          />
        </div>
      </div>
    </header>
  );
}
