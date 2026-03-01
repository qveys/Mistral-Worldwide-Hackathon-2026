'use client';

import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

export function ActivityFilters() {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-[2rem]",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className="relative w-full sm:w-72 group">
        <Search size={14} className={cn("absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors", isDarkMode ? "text-zinc-600" : "text-slate-500")} />
        <input 
          type="text" 
          placeholder="Filter events..." 
          className={cn(
            "w-full rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none transition-all",
            isDarkMode ? "bg-zinc-900/50 border border-zinc-800 focus:border-violet-500/50 text-zinc-300" : "bg-slate-50 border border-slate-300 focus:border-violet-500/50 text-slate-800"
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <button className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
          isDarkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white" : "bg-slate-100 border border-slate-300 text-slate-600 hover:text-slate-900"
        )}>
          <Filter size={12} /> Type
        </button>
        <button className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
          isDarkMode ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white" : "bg-slate-100 border border-slate-300 text-slate-600 hover:text-slate-900"
        )}>
          <SortAsc size={12} /> Date
        </button>
      </div>
    </div>
  );
}
