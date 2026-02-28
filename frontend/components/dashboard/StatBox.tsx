'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatBoxProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  color?: string;
  progress?: number;
  className?: string;
}

export function StatBox({ 
  label, 
  value, 
  detail, 
  icon: Icon, 
  color = "text-amber-500", 
  progress,
  className 
}: StatBoxProps) {
  return (
    <div className={cn("bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 flex flex-col justify-between group", className)}>
      <div className="flex justify-between items-center">
        <Icon size={20} className={cn(color, "group-hover:scale-110 transition-transform")} />
        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{detail}</span>
      </div>
      <div className="space-y-3">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-medium text-white tracking-tighter">{value}</p>
        {progress !== undefined && (
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-1000", color.replace('text-', 'bg-'))} 
              style={{ width: `${progress}%`, boxShadow: `0 0 10px rgba(var(--${color}-rgb), 0.3)` }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
