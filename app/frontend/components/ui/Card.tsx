'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'blocked' | 'done';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

export function Card({ children, variant = 'default', className }: CardProps) {
  const variants = {
    default: "bg-white/40 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 shadow-sm hover:shadow-xl",
    blocked: "bg-slate-100/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200 dark:border-slate-800 opacity-40 grayscale-[0.8] cursor-not-allowed",
    done: "bg-white/40 dark:bg-black/40 backdrop-blur-md border-white/20 dark:border-white/10 opacity-60 grayscale-[0.5]",
  };

  return (
    <div className={cn(
      "p-6 rounded-[2rem] border transition-all duration-300",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}
