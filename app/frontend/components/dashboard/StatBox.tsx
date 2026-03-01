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
  variant?: 'dark' | 'light';
}

export function StatBox({ 
  label, 
  value, 
  detail, 
  icon: Icon, 
  color = "text-amber-500", 
  progress,
  className,
  variant = 'dark',
}: StatBoxProps) {
  const isLight = variant === 'light';
  return (
    <div className={cn(
      "rounded-[2.5rem] p-8 flex flex-col justify-between group",
      isLight ? "bg-white border-2 border-slate-300 shadow-lg" : "bg-[#161618] border border-zinc-800/50",
      className
    )}>
      <div className="flex justify-between items-center">
        <Icon size={20} className={cn(color, "group-hover:scale-110 transition-transform")} />
        <span className={cn("text-[10px] font-mono px-2 py-1 rounded", isLight ? "text-slate-600 bg-slate-200" : "text-zinc-500 bg-zinc-800")}>{detail}</span>
      </div>
      <div className="space-y-3">
        <p className={cn("text-[10px] font-bold uppercase tracking-widest", isLight ? "text-slate-600" : "text-zinc-600")}>{label}</p>
        <p className={cn("text-4xl font-medium tracking-tighter", isLight ? "text-slate-900" : "text-white")}>{value}</p>
        {progress !== undefined && (
          <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isLight ? "bg-slate-200" : "bg-zinc-800")}>
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
