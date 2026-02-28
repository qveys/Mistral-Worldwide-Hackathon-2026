'use client';

import React from 'react';
import { 
  Activity, 
  BarChart3, 
  Target, 
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActivityStats() {
  const stats = [
    { label: 'Weekly Events', value: '1,284', trend: '+12%', icon: Activity, color: 'text-violet-400' },
    { label: 'Avg Inference', value: '42ms', trend: '-2ms', icon: Zap, color: 'text-amber-400' },
    { label: 'Success Rate', value: '99.9%', trend: 'Stable', icon: Target, color: 'text-emerald-400' },
    { label: 'Neural Flux', value: '48.2k', trend: '+15.8%', icon: BarChart3, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 bg-[#161618] border border-zinc-800/50 rounded-3xl flex flex-col justify-between group hover:border-zinc-700 transition-all">
          <div className="flex justify-between items-start">
            <div className={cn("p-2 rounded-xl bg-zinc-800", stat.color)}>
              <stat.icon size={18} />
            </div>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{stat.trend}</span>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
