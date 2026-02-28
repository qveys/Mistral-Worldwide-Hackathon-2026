'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export function TimelineHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Calendar size={12} />
        Workspace / Roadmap Timeline
      </div>
      <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
        Master <span className="text-zinc-600 italic font-serif text-3xl lg:text-4xl">Timeline</span>
      </h2>
    </div>
  );
}
