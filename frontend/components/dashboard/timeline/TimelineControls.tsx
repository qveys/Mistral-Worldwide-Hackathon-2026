'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Download, Filter, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimelineControls() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#161618] border border-zinc-800/50 p-4 rounded-[2rem]">
      <div className="flex items-center gap-4">
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
            <ChevronLeft size={16} />
          </button>
          <button className="px-4 py-1.5 bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest">
            March 2026
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
        <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
          Today
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          {['Day', 'Week', 'Month'].map((mode) => (
            <button 
              key={mode}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                mode === 'Week' ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
        <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
          <Filter size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20">
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
}
