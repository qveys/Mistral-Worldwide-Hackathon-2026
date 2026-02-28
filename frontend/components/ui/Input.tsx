'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl py-4 px-5 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm",
          error && "border-red-500/50 focus:border-red-500",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-wider italic">
          {error}
        </p>
      )}
    </div>
  );
}
