'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

interface ActivityHeatmapProps {
  data: number[];
  title?: string;
  className?: string;
}

export function ActivityHeatmap({ data, title = "Neural Activity", className }: ActivityHeatmapProps) {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className={cn(
      "rounded-[2rem] p-8 flex flex-col justify-between h-full",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg",
      className
    )}>
      <div className="flex justify-between items-center">
        <h3 className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{title}</h3>
        <Badge className="bg-violet-500/10 text-violet-400 border-none text-[9px]">Live</Badge>
      </div>
      <div className="grid grid-cols-14 grid-rows-7 gap-1.5 h-36 w-full mt-4">
        {data.map((level, i) => (
          <div 
            key={i} 
            className={cn(
              "rounded-[2px] w-full h-full transition-colors duration-500",
              level === 0 ? (isDarkMode ? "bg-zinc-800/50" : "bg-slate-200") : 
              level === 1 ? "bg-violet-900/40" : 
              level === 2 ? "bg-violet-600/60" : 
              "bg-violet-400"
            )} 
          />
        ))}
      </div>
      <div className={cn("flex items-center justify-between text-[10px] font-mono mt-4", isDarkMode ? "text-zinc-600" : "text-slate-600")}>
        <span>14 WEEK FLOW</span>
        <span className={cn("font-bold tracking-widest uppercase", isDarkMode ? "text-white" : "text-slate-900")}>{data.filter(l => l > 0).length} Syncs</span>
      </div>
    </div>
  );
}
