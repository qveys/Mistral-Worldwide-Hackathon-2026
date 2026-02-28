'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, CheckCircle2, Zap, BarChart3 } from 'lucide-react';

type BadgeVariant = 'status' | 'priority' | 'estimate' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  type?: string; // e.g., 'backlog', 'high', 'S'
  className?: string;
}

export function Badge({ children, variant = 'default', type, className }: BadgeProps) {
  const getStyles = () => {
    if (variant === 'status') {
      switch (type) {
        case 'backlog': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        case 'doing': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        case 'done': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
        default: return 'bg-slate-100 text-slate-600';
      }
    }
    if (variant === 'priority') {
      switch (type) {
        case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30';
        case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30';
        case 'low': return 'text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30';
        default: return 'text-slate-500 bg-slate-50';
      }
    }
    if (variant === 'estimate') {
      return 'bg-white/50 dark:bg-white/5 border-white/20 text-slate-500 dark:text-slate-400';
    }
    return 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400';
  };

  const getIcon = () => {
    if (variant === 'priority') {
      switch (type) {
        case 'high': return <AlertCircle size={10} />;
        case 'medium': return <Clock size={10} />;
        case 'low': return <Zap size={10} />;
      }
    }
    if (variant === 'estimate') return <BarChart3 size={10} />;
    return null;
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-transparent transition-all",
      getStyles(),
      className
    )}>
      {getIcon()}
      {children}
    </div>
  );
}
