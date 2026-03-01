'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

import type { TimelineZoomMode } from '@/components/dashboard/timeline/timeline.constants';

interface TimelineTask {
  id: string;
  title: string;
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
  const dayCount = zoomMode === 'day' ? 1 : zoomMode === 'week' ? 7 : 31;
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  return (
    <div className={cn(
      "rounded-[2.5rem] p-8 overflow-hidden flex flex-col gap-8",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className={cn("flex items-center justify-between border-b pb-6", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
        <h3 className={cn("text-[11px] font-bold uppercase tracking-[0.3em] px-2", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Deployment Schedule</h3>
        <div className={cn("flex gap-4 text-[9px] font-mono", isDarkMode ? "text-zinc-600" : "text-slate-600")}>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Done</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Active</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-700" /> Pending</span>
        </div>
      </div>

      <div className="relative overflow-x-auto custom-scrollbar pb-4">
        {/* Days Header */}
        <div className={cn("flex border-b mb-4", zoomMode === 'day' ? "min-w-[200px]" : zoomMode === 'week' ? "min-w-[600px]" : "min-w-[1200px]", isDarkMode ? "border-zinc-800/30" : "border-slate-200")}>
          {days.map(day => (
            <div key={day} className={cn("flex-1 text-center py-2 text-[10px] font-mono border-r", isDarkMode ? "text-zinc-700 border-zinc-800/10" : "text-slate-600 border-slate-200")}>
              {zoomMode === 'day' ? 'Day' : day.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className={cn("space-y-3 relative", zoomMode === 'day' ? "min-w-[200px]" : zoomMode === 'week' ? "min-w-[600px]" : "min-w-[1200px]")}>
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 flex pointer-events-none">
            {days.map(day => (
              <div key={day} className={cn("flex-1 border-r h-full", isDarkMode ? "border-zinc-800/5" : "border-slate-200")} />
            ))}
          </div>

          {tasks.map((task, idx) => {
            // Simple mock positioning
            const startPos = (idx * 3) + 2;
            const width = 6 + (idx * 2);
            
            return (
              <div key={task.id} className="relative h-10 group">
                <div 
                  className={cn(
                    "absolute h-full rounded-xl border border-white/5 flex items-center px-4 transition-all group-hover:scale-[1.02] cursor-pointer shadow-lg",
                    task.color
                  )}
                    style={{ 
                    left: `${Math.min(startPos / dayCount, 1) * 100}%`, 
                    width: `${Math.min(width / dayCount, 1) * 100}%` 
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold truncate">{task.title}</span>
                    <span className="text-[9px] font-black opacity-50 ml-2">{task.progress}%</span>
                  </div>
                  {/* Progress Bar inside */}
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
