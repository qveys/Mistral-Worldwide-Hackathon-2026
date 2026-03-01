'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Settings size={12} />
        Workspace / System Settings
      </div>
      <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
        Console <span className="text-zinc-600 italic font-serif text-3xl lg:text-4xl">Preferences</span>
      </h2>
    </div>
  );
}
