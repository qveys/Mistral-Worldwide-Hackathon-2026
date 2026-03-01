'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import type { TimelineZoomMode } from '@/components/dashboard/timeline/timeline.constants';

interface TimelineControlsProps {
  zoomMode: TimelineZoomMode;
  onZoomModeChange: (mode: TimelineZoomMode) => void;
}

export function TimelineControls({ zoomMode, onZoomModeChange }: TimelineControlsProps) {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('timeline');

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-[2rem]",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn("flex rounded-xl p-1", isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-slate-200 border border-slate-300")}>
          <button className={cn("p-2 rounded-lg transition-all", isDarkMode ? "hover:bg-zinc-800 text-zinc-500 hover:text-white" : "hover:bg-slate-300 text-slate-600 hover:text-slate-900")}>
            <ChevronLeft size={16} />
          </button>
          <button className={cn("px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest", isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-slate-900 shadow-sm")}>
            {t('march2026')}
          </button>
          <button className={cn("p-2 rounded-lg transition-all", isDarkMode ? "hover:bg-zinc-800 text-zinc-500 hover:text-white" : "hover:bg-slate-300 text-slate-600 hover:text-slate-900")}>
            <ChevronRight size={16} />
          </button>
        </div>
        <button className={cn(
          "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
          isDarkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white" : "bg-slate-100 border border-slate-300 text-slate-600 hover:text-slate-900"
        )}>
          {t('today')}
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={cn("flex rounded-xl p-1", isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-slate-200 border border-slate-300")}>
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button 
              key={mode}
              type="button"
              onClick={() => onZoomModeChange(mode)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                zoomMode === mode ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-600 hover:text-zinc-400" : "text-slate-600 hover:text-slate-900")
              )}
            >
              {t(mode)}
            </button>
          ))}
        </div>
        <div className={cn("h-8 w-[1px] mx-2", isDarkMode ? "bg-zinc-800" : "bg-slate-300")} />
        <button className={cn(
          "p-2.5 rounded-xl transition-all",
          isDarkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white" : "bg-slate-100 border border-slate-300 text-slate-600 hover:text-slate-900"
        )}>
          <Filter size={16} />
        </button>
        <button className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-lg", isDarkMode ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20" : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20")}>
          <Download size={14} /> {t('export')}
        </button>
      </div>
    </div>
  );
}
