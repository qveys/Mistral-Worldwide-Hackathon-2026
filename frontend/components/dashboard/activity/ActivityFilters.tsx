'use client';

import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

export function ActivityFilters() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#161618] border border-zinc-800/50 p-4 rounded-[2rem]">
      <div className="relative w-full sm:w-72 group">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Filter events..." 
          className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-violet-500/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-300 outline-none transition-all"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
          <Filter size={12} /> Type
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
          <SortAsc size={12} /> Date
        </button>
      </div>
    </div>
  );
}
