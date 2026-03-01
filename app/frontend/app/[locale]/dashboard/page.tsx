'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { ConsoleHero } from '@/components/dashboard/ConsoleHero';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { RoadmapCard } from '@/components/dashboard/RoadmapCard';
import { StatBox } from '@/components/dashboard/StatBox';
import { CollaborationHub } from '@/components/dashboard/CollaborationHub';
import { STATIC_ACTIVITY_DATA } from '@/components/dashboard/activity/activity.constants';

const RECENT_PROJECT_KEYS = [
  { id: '1', titleKey: 'recentProject1Title', statusKey: 'statusStable', lastEditKey: 'lastEdit2m', nodes: 24 },
  { id: '2', titleKey: 'recentProject2Title', statusKey: 'statusReview', lastEditKey: 'lastEdit1h', nodes: 12 },
  { id: '3', titleKey: 'recentProject3Title', statusKey: 'statusDraft', lastEditKey: 'lastEdit4h', nodes: 18 },
  { id: '4', titleKey: 'recentProject4Title', statusKey: 'statusStable', lastEditKey: 'lastEdit1d', nodes: 32 },
] as const;

export default function DashboardOverview() {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('dashboard');
  const recentProjects = RECENT_PROJECT_KEYS.map((p) => ({
    id: p.id,
    title: t(p.titleKey),
    status: t(p.statusKey),
    lastEdit: t(p.lastEditKey),
    nodes: p.nodes,
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 auto-rows-[160px]">
        <ConsoleHero />

        <div className="col-span-12 lg:col-span-4 row-span-2">
          <ActivityHeatmap data={STATIC_ACTIVITY_DATA} />
        </div>

        <div
          className={cn(
            'col-span-12 lg:col-span-8 row-span-3 rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden',
            isDarkMode ? 'bg-[#161618] border border-zinc-800/50' : 'bg-white border-2 border-slate-300 shadow-lg'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-between border-b pb-6',
              isDarkMode ? 'border-zinc-800/50' : 'border-slate-200'
            )}
          >
            <h3
              className={cn(
                'text-[11px] font-bold uppercase tracking-[0.3em] px-2',
                isDarkMode ? 'text-zinc-500' : 'text-slate-600'
              )}
            >
              {t('activeUnits')}
            </h3>
            <Link
              href="/dashboard/roadmaps"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all',
                isDarkMode
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40 hover:bg-blue-500/25 hover:border-blue-400/60'
                  : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 shadow-sm'
              )}
            >
              {t('exploreRoadmaps')} <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentProjects.map((project) => (
              <RoadmapCard key={project.id} {...project} variant="list" />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 row-span-3 flex flex-col gap-4">
          <StatBox
            label={t('inferenceSpeed')}
            value={t('inferenceSpeedValue')}
            detail={t('inferenceSpeedDetail')}
            icon={Zap}
            color="text-amber-500"
            progress={84}
            className="flex-1"
            variant={isDarkMode ? 'dark' : 'light'}
          />
          <StatBox
            label={t('topologicalSort')}
            value={t('topologicalSortValue')}
            detail={t('topologicalSortDetail')}
            icon={CheckCircle2}
            color="text-emerald-500"
            progress={100}
            className="flex-1"
            variant={isDarkMode ? 'dark' : 'light'}
          />
        </div>

        <div className="col-span-12 row-span-1 mt-2">
          <CollaborationHub />
        </div>
      </div>
    </div>
  );
}
