'use client';

import React from 'react';

// Timeline Components
import { TimelineHeader } from '@/components/dashboard/timeline/TimelineHeader';
import { TimelineControls } from '@/components/dashboard/timeline/TimelineControls';
import { TimelineView } from '@/components/dashboard/timeline/TimelineView';
import { TimelineLegend } from '@/components/dashboard/timeline/TimelineLegend';

// Constants
import { TIMELINE_TASKS } from '@/components/dashboard/timeline/timeline.constants';

export default function TimelinePage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      
      <TimelineHeader />
      <TimelineControls />

      <div className="grid grid-cols-12 gap-4">
        
        {/* Main Timeline Area */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <TimelineView tasks={TIMELINE_TASKS} />
        </div>

        {/* Sidebar Info Area */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <TimelineLegend />
          
          <div className="bg-[#161618] border border-zinc-800/50 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Timeline Sync</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium italic">
              Mistral is optimizing your schedule based on resource availability.
            </p>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-1/3 animate-pulse" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
