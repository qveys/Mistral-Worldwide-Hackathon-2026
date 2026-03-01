'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

import type { TimelineZoomMode } from '@/components/dashboard/timeline/timeline.constants';

interface TimelineTask {
  id: string;
  titleKey: string;
  start: string;
  end: string;
  status: string;
  color: string;
  progress: number;
}

interface TimelineViewProps {
  tasks: TimelineTask[];
  zoomMode?: TimelineZoomMode;
}

export function TimelineView({ tasks, zoomMode = 'week' }: TimelineViewProps) {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('timeline');
  const dayCount = zoomMode === 'day' ? 1 : zoomMode === 'week' ? 7 : 31;
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className={cn(
      "rounded-xl max-sm:rounded-xl sm:rounded-[2.5rem] p-4 max-sm:p-4 sm:p-6 md:p-8 overflow-hidden flex flex-col gap-4 max-sm:gap-4 sm:gap-8 min-w-0",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className={cn("flex flex-col max-sm:flex-col sm:flex-row items-start max-sm:items-stretch sm:items-center justify-between gap-3 max-sm:gap-3 sm:gap-0 border-b pb-4 max-sm:pb-4 sm:pb-6", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
        <h3 className={cn("text-[10px] max-sm:text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] max-sm:tracking-[0.2em] sm:tracking-[0.3em] px-0 max-sm:px-0 sm:px-2 shrink-0", isDarkMode ? "text-zinc-500" : "text-slate-600")}>
          {t('deploymentSchedule')}
        </h3>
        <div className={cn("flex flex-wrap gap-x-3 max-sm:gap-x-3 sm:gap-x-4 gap-y-1 text-[8px] max-sm:text-[8px] sm:text-[9px] font-mono", isDarkMode ? "text-zinc-600" : "text-slate-600")}>
          <span className="flex items-center gap-1.5 shrink-0"><div className="w-1.5 h-1.5 max-sm:w-1.5 max-sm:h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" /> {t('statusDone')}</span>
          <span className="flex items-center gap-1.5 shrink-0"><div className="w-1.5 h-1.5 max-sm:w-1.5 max-sm:h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 shrink-0" /> {t('statusActive')}</span>
          <span className="flex items-center gap-1.5 shrink-0"><div className="w-1.5 h-1.5 max-sm:w-1.5 max-sm:h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-700 shrink-0" /> {t('statusPending')}</span>
        </div>
      </div>

      <div className="relative overflow-x-auto custom-scrollbar pb-4">
        {/* Days Header */}
        <div className={cn("flex border-b mb-3 max-sm:mb-3 sm:mb-4", zoomMode === 'day' ? "min-w-[200px]" : zoomMode === 'week' ? "min-w-[600px]" : "min-w-[1200px]", isDarkMode ? "border-zinc-800/30" : "border-slate-200")}>
          {days.map(day => (
            <div key={day} className={cn("flex-1 text-center py-1.5 max-sm:py-1.5 sm:py-2 text-[9px] max-sm:text-[9px] sm:text-[10px] font-mono border-r", isDarkMode ? "text-zinc-700 border-zinc-800/10" : "text-slate-600 border-slate-200")}>
              {zoomMode === 'day' ? t('day') : day.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className={cn("space-y-2 max-sm:space-y-2 sm:space-y-3 relative", zoomMode === 'day' ? "min-w-[200px]" : zoomMode === 'week' ? "min-w-[600px]" : "min-w-[1200px]")}>
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 flex pointer-events-none">
            {days.map(day => (
              <div key={day} className={cn("flex-1 border-r h-full", isDarkMode ? "border-zinc-800/5" : "border-slate-200")} />
            ))}
          </div>

          {tasks.map((task, idx) => {
            const startPos = (idx * 3) + 2;
            const width = 6 + (idx * 2);

            return (
              <div key={task.id} className="relative h-8 max-sm:h-8 sm:h-10 group">
                <div
                  className={cn(
                    "absolute h-full rounded-lg max-sm:rounded-lg sm:rounded-xl border border-white/5 flex items-center px-2 max-sm:px-2 sm:px-4 transition-all group-hover:scale-[1.02] cursor-pointer shadow-lg",
                    task.color
                  )}
                  style={{
                    left: `${Math.min(startPos / dayCount, 1) * 100}%`,
                    width: `${Math.min(width / dayCount, 1) * 100}%`
                  }}
                >
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="text-[10px] max-sm:text-[10px] sm:text-xs font-bold truncate">{t(task.titleKey)}</span>
                    <span className="text-[8px] max-sm:text-[8px] sm:text-[9px] font-black opacity-50 ml-1 max-sm:ml-1 sm:ml-2 shrink-0">{task.progress}%</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 rounded-full" style={{ width: `${task.progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
