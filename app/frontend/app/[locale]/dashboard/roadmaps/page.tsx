'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';
import { RoadmapCard } from '@/components/dashboard/RoadmapCard';
import { RoadmapControls } from '@/components/dashboard/roadmaps/RoadmapControls';

const ROADMAP_KEYS = [
  { id: '1', titleKey: 'recentProject1Title', statusKey: 'statusStable', lastEditKey: 'lastEdit2m', nodes: 24, team: 4 },
  { id: '2', titleKey: 'recentProject2Title', statusKey: 'statusReview', lastEditKey: 'lastEdit1h', nodes: 12, team: 2 },
  { id: '3', titleKey: 'recentProject3Title', statusKey: 'statusDraft', lastEditKey: 'lastEdit4h', nodes: 18, team: 1 },
  { id: '4', titleKey: 'recentProject4Title', statusKey: 'statusStable', lastEditKey: 'lastEdit1d', nodes: 32, team: 3 },
  { id: '5', titleKey: 'roadmapsPageProject5Title', statusKey: 'statusDraft', lastEditKey: 'roadmapsPageLastEdit2d', nodes: 45, team: 5 },
  { id: '6', titleKey: 'roadmapsPageProject6Title', statusKey: 'statusStable', lastEditKey: 'roadmapsPageLastEdit1w', nodes: 8, team: 2 },
] as const;

export default function RoadmapsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('dashboard');
  const roadmaps = ROADMAP_KEYS.map((roadmap) => ({
    id: roadmap.id,
    title: t(roadmap.titleKey),
    status: t(roadmap.statusKey),
    lastEdit: t(roadmap.lastEditKey),
    nodes: roadmap.nodes,
    team: roadmap.team,
  }));

  return (
    <div className="p-4 max-sm:px-3 sm:p-6 lg:p-10 space-y-6 max-sm:space-y-6 sm:space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-stretch max-sm:items-stretch md:items-center gap-4 max-sm:gap-4 sm:gap-6">
        <DashboardPageHeader title={t('roadmaps')} accent={t('roadmapsPageAccent')} />

        <div className="flex flex-col max-sm:flex-col sm:flex-row items-stretch max-sm:gap-2 sm:items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(
              'inline-flex items-center justify-center gap-2 h-10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all max-sm:h-11',
              isDarkMode
                ? 'text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600'
                : 'text-slate-600 hover:text-slate-900 border-2 border-slate-300 hover:border-slate-400'
            )}
          >
            <LayoutDashboard size={16} />
            {t('roadmapsPageConsole')}
          </Link>
          <Link href="/dashboard/roadmaps/new" className="max-sm:w-full">
            <Button
              className={cn(
                '!h-10 !px-5 !py-2 !rounded-full font-bold transition-all group text-sm max-sm:!w-full max-sm:!h-11 max-sm:!justify-center',
                isDarkMode
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/5'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
              )}
            >
              <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
              {t('roadmapsPageInitializeRoadmap')}
            </Button>
          </Link>
        </div>
      </div>

      <RoadmapControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-sm:gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[240px]'
            : cn(
                'space-y-2 rounded-[2.5rem] p-3 max-sm:p-3 sm:p-4',
                isDarkMode ? 'bg-[#161618] border border-zinc-800/50' : 'bg-white border-2 border-slate-300 shadow-lg'
              )
        )}
      >
        {roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} {...roadmap} variant={viewMode} />
        ))}

        {viewMode === 'grid' && (
          <Link
            href="/dashboard/roadmaps/new"
            className={cn(
              'group flex flex-col items-center justify-center p-6 max-sm:p-4 sm:p-8 border border-dashed rounded-[2rem] max-sm:rounded-xl hover:border-[#536dfe]/50 hover:bg-[#536dfe]/5 transition-all hover:text-[#536dfe]',
              isDarkMode ? 'bg-zinc-900/20 border-zinc-800 text-zinc-600' : 'bg-slate-50 border-slate-300 text-slate-600'
            )}
          >
            <div
              className={cn(
                'h-12 w-12 max-sm:h-10 max-sm:w-10 sm:h-14 sm:w-14 rounded-full border border-dashed flex items-center justify-center mb-3 max-sm:mb-2 sm:mb-4 group-hover:scale-110 transition-transform',
                isDarkMode ? 'border-zinc-700' : 'border-slate-400'
              )}
            >
              <Plus size={24} className="max-sm:w-5 max-sm:h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="text-xs max-sm:text-[10px] sm:text-sm font-bold uppercase tracking-widest italic">{t('roadmapsPageNewCluster')}</p>
          </Link>
        )}
      </div>
    </div>
  );
}
