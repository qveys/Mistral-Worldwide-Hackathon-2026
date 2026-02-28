'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineTask {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  color: string;
  progress: number;
}

export function TimelineView({ tasks }: { tasks: TimelineTask[] }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 overflow-hidden flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500 px-2">Deployment Schedule</h3>
        <div className="flex gap-4 text-[9px] font-mono text-zinc-600">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Done</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-500" /> Active</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-700" /> Pending</span>
        </div>
      </div>

      <div className="relative overflow-x-auto custom-scrollbar pb-4">
        {/* Days Header */}
        <div className="flex border-b border-zinc-800/30 mb-4 min-w-[1200px]">
          {days.map(day => (
            <div key={day} className="flex-1 text-center py-2 text-[10px] font-mono text-zinc-700 border-r border-zinc-800/10">
              {day.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className="space-y-3 min-w-[1200px] relative">
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 flex pointer-events-none">
            {days.map(day => (
              <div key={day} className="flex-1 border-r border-zinc-800/5 h-full" />
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
                    left: `${(startPos / 31) * 100}%`, 
                    width: `${(width / 31) * 100}%` 
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
