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
      "flex flex-col sm:flex-row gap-3 max-sm:gap-3 sm:gap-4 items-stretch max-sm:items-stretch sm:items-center justify-between p-3 max-sm:p-3 sm:p-4 rounded-2xl max-sm:rounded-xl sm:rounded-3xl",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className="relative w-full sm:w-96 group min-w-0">
        <Search size={16} className={cn("absolute left-3 max-sm:left-3 sm:left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#536dfe] transition-colors", isDarkMode ? "text-zinc-600" : "text-slate-500")} />
        <input 
          type="text" 
          placeholder={t('searchRoadmaps')} 
          className={cn(
            "w-full rounded-xl py-2.5 max-sm:py-2.5 sm:py-3 pl-10 max-sm:pl-10 sm:pl-12 pr-3 max-sm:pr-3 sm:pr-4 text-sm outline-none transition-all",
            isDarkMode ? "bg-zinc-900/50 border border-zinc-800 focus:border-[#536dfe]/50 text-zinc-300" : "bg-slate-50 border border-slate-300 focus:border-[#536dfe]/50 text-slate-800"
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap max-sm:flex-wrap sm:flex-nowrap items-center gap-2 max-sm:justify-between">
        <div className={cn("flex rounded-xl p-1 shrink-0", isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-slate-200 border border-slate-300")}>
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-lg transition-all duration-200", viewMode === 'grid' ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300" : "text-slate-600 hover:bg-slate-300/50 hover:text-slate-900"))}
          >
            <LayoutGrid size={18} className="max-sm:w-4 max-sm:h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-lg transition-all duration-200", viewMode === 'list' ? (isDarkMode ? "bg-zinc-800 text-white" : "bg-white text-slate-900 shadow-sm") : (isDarkMode ? "text-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-300" : "text-slate-600 hover:bg-slate-300/50 hover:text-slate-900"))}
          >
            <List size={18} className="max-sm:w-4 max-sm:h-4" />
          </button>
        </div>
        <div className={cn("h-6 max-sm:h-6 sm:h-8 w-[1px] mx-1 max-sm:mx-1 sm:mx-2 shrink-0 hidden max-sm:hidden sm:block", isDarkMode ? "bg-zinc-800" : "bg-slate-300")} />
        <button className={cn(
          "flex items-center gap-1.5 max-sm:gap-1 sm:gap-2 px-3 max-sm:px-3 sm:px-4 py-2 max-sm:py-2 sm:py-2.5 rounded-xl text-[10px] max-sm:text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer shrink-0",
          isDarkMode 
            ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white" 
            : "bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-slate-900"
        )}>
          <Filter size={14} className="max-sm:w-3 max-sm:h-3 shrink-0" /> <span className="max-sm:hidden">{t('filter')}</span>
        </button>
        <button className={cn(
          "flex items-center gap-1.5 max-sm:gap-1 sm:gap-2 px-3 max-sm:px-3 sm:px-4 py-2 max-sm:py-2 sm:py-2.5 rounded-xl text-[10px] max-sm:text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer shrink-0",
          isDarkMode 
            ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-white" 
            : "bg-slate-100 border border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-slate-900"
        )}>
          <SortAsc size={14} className="max-sm:w-3 max-sm:h-3 shrink-0" /> <span className="max-sm:hidden">{t('sort')}</span>
        </button>
      </div>
    </div>
  );
}
