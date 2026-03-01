'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

interface DashboardPageHeaderProps {
  title: string;
  accent: string;
}

export function DashboardPageHeader({ title, accent }: DashboardPageHeaderProps) {
  const { isDarkMode } = useDashboardTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "relative pl-6 border-l-2",
        isDarkMode ? "border-violet-500/40" : "border-violet-500/50"
      )}
    >
      <h1
        className={cn(
          "text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.1]",
          isDarkMode ? "text-white" : "text-slate-900"
        )}
      >
        {title}{' '}
        <span
          className={cn(
            "italic font-serif text-3xl lg:text-4xl xl:text-5xl",
            isDarkMode
              ? "bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-700 bg-clip-text text-transparent"
          )}
        >
          {accent}
        </span>
      </h1>
    </motion.header>
  );
}
