'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-slate-800 shadow-xl shadow-black/5 dark:bg-white dark:text-black dark:hover:bg-slate-200",
    secondary: "bg-white/60 text-slate-900 border border-slate-200 backdrop-blur-md hover:bg-white dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="absolute" />}
      <span className={cn("flex items-center gap-2 transition-opacity", isLoading && "opacity-0")}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
}
