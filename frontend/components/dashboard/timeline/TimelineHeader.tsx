'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

export function TimelineHeader() {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className="space-y-2">
      <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]", isDarkMode ? "text-zinc-500" : "text-slate-600")}>
        <Calendar size={12} />
        Workspace / Roadmap Timeline
      </div>
      <h2 className={cn("text-4xl lg:text-5xl font-medium tracking-tight leading-tight", isDarkMode ? "text-white" : "text-slate-900")}>
        <span className={cn("italic font-serif text-3xl lg:text-4xl", isDarkMode ? "text-zinc-600" : "text-slate-600")}>Timeline</span>
      </h2>
    </div>
  );
}
