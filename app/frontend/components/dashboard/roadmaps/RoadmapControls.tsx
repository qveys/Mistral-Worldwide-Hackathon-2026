'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Search, LayoutGrid, List, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

interface RoadmapControlsProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function RoadmapControls({ viewMode, setViewMode, searchQuery, setSearchQuery }: RoadmapControlsProps) {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('dashboard');

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-3xl",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className="relative w-full sm:w-96 group">
        <Search size={16} className={cn("absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors", isDarkMode ? "text-zinc-600" : "text-slate-500")} />
        <input 
          type="text" 
          placeholder={t('searchRoadmaps')} 
          className={cn(
            "w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none transition-all",
            isDarkMode ? "bg-zinc-900/50 border border-zinc-800 focus:border-violet-500/50 text-zinc-300" : "bg-slate-50 border border-slate-300 focus:border-violet-500/50 text-slate-800"
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className={cn("flex rounded-xl p-1", isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-slate-200 border border-slate-300")}>
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-lg transition-all duration-200", viewMode === 'grid' ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300" : "text-slate-600 hover:bg-slate-300/50 hover:text-slate-900"))}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-lg transition-all duration-200", viewMode === 'list' ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300" : "text-slate-600 hover:bg-slate-300/50 hover:text-slate-900"))}
          >
            <List size={18} />
          </button>
        </div>
        <div className={cn("h-8 w-[1px] mx-2", isDarkMode ? "bg-zinc-800" : "bg-slate-300")} />
        <button className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer",
          isDarkMode 
            ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white" 
            : "bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-slate-900"
        )}>
          <Filter size={14} /> {t('filter')}
        </button>
        <button className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer",
          isDarkMode 
            ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white" 
            : "bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-slate-900"
        )}>
          <SortAsc size={14} /> {t('sort')}
        </button>
      </div>
    </div>
  );
}
