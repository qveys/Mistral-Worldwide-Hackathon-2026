'use client';

import React from 'react';
import { History } from 'lucide-react';

export function ActivityHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        <History size={12} />
        Workspace / Activity Log
      </div>
      <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
        System <span className="text-zinc-600 italic font-serif text-3xl lg:text-4xl">Activity</span>
      </h2>
    </div>
  );
}
