'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, BarChart3, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

const STAT_KEYS = ['weeklyEvents', 'avgInference', 'successRate', 'neuralFlux'] as const;

export function ActivityStats() {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('dashboard');
  const stats = [
    { labelKey: STAT_KEYS[0], value: '1,284', trend: '+12%', icon: Activity, color: 'text-violet-400' },
    { labelKey: STAT_KEYS[1], value: '42ms', trend: '-2ms', icon: Zap, color: 'text-amber-400' },
    { labelKey: STAT_KEYS[2], value: '99.9%', trend: t('statusStable'), icon: Target, color: 'text-emerald-400' },
    { labelKey: STAT_KEYS[3], value: '48.2k', trend: '+15.8%', icon: BarChart3, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={cn(
          "p-6 rounded-3xl flex flex-col justify-between group transition-all",
          isDarkMode ? "bg-[#161618] border border-zinc-800/50 hover:border-zinc-700" : "bg-white border-2 border-slate-300 shadow-lg hover:border-slate-400"
        )}>
          <div className="flex justify-between items-start">
            <div className={cn("p-2 rounded-xl", stat.color, isDarkMode ? "bg-zinc-800" : "bg-slate-200")}>
              <stat.icon size={18} />
            </div>
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-zinc-600" : "text-slate-600")}>{stat.trend}</span>
          </div>
          <div className="mt-4 space-y-1">
            <p className={cn("text-xl font-bold tracking-tight", isDarkMode ? "text-white" : "text-slate-900")}>{stat.value}</p>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{t(stat.labelKey)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
