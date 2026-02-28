'use client';

import React from 'react';
import { Search, LayoutGrid, List, Filter, SortAsc } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapControlsProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function RoadmapControls({ viewMode, setViewMode, searchQuery, setSearchQuery }: RoadmapControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#161618] border border-zinc-800/50 p-4 rounded-3xl">
      <div className="relative w-full sm:w-96 group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search clusters..." 
          className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-violet-500/50 rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-300 outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400")}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400")}
          >
            <List size={18} />
          </button>
        </div>
        <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
        <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
          <Filter size={14} /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
          <SortAsc size={14} /> Sort
        </button>
      </div>
    </div>
  );
}
