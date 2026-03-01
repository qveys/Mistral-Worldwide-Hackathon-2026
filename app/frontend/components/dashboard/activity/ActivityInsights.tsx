'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

export function ActivityInsights({ insights }: { insights: string[] }) {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className={cn(
      "rounded-[2rem] p-8 space-y-6",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <h3 className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Live Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />
            <p className={cn("text-[11px] leading-relaxed italic font-medium", isDarkMode ? "text-zinc-400" : "text-slate-600")}>{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
