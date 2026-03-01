'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

// Timeline Components
import { TimelineHeader } from '@/components/dashboard/timeline/TimelineHeader';
import { TimelineControls } from '@/components/dashboard/timeline/TimelineControls';
import { TimelineView } from '@/components/dashboard/timeline/TimelineView';
import { TimelineLegend } from '@/components/dashboard/timeline/TimelineLegend';

// Constants
import { TIMELINE_TASKS } from '@/components/dashboard/timeline/timeline.constants';

export default function TimelinePage() {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className="p-6 lg:p-10 space-y-8">
      
      <TimelineHeader />
      <TimelineControls />

      <div className="grid grid-cols-12 gap-4">
        
        {/* Main Timeline Area */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <TimelineView tasks={TIMELINE_TASKS} />
        </div>

        {/* Sidebar Info Area */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <TimelineLegend />
          
          <div className={cn(
            "rounded-[2rem] p-8 space-y-6",
            isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
          )}>
            <h3 className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Timeline Sync</h3>
            <p className={cn("text-[11px] leading-relaxed font-medium italic", isDarkMode ? "text-zinc-400" : "text-slate-600")}>
              Mistral is optimizing your schedule based on resource availability.
            </p>
            <div className={cn("h-1 w-full rounded-full overflow-hidden", isDarkMode ? "bg-zinc-800" : "bg-slate-200")}>
              <div className="h-full bg-violet-500 w-1/3 animate-pulse" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
