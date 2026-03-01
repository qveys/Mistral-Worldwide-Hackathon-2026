'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

export function TimelineLegend() {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('timeline');

  return (
    <div className={cn(
      "rounded-[2rem] p-8 space-y-8",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className="space-y-4">
        <h3 className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{t('resourceAllocation')}</h3>
        <div className="space-y-3">
          {[
            { labelKey: 'computeUnit' as const, val: '84%', icon: Zap, color: 'text-amber-500' },
            { labelKey: 'mapIntegrity' as const, val: '100%', icon: Target, color: 'text-emerald-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <item.icon size={14} className={item.color} />
                <span className={cn("text-[11px] font-medium", isDarkMode ? "text-zinc-400" : "text-slate-600")}>{t(item.labelKey)}</span>
              </div>
              <span className={cn("text-[10px] font-mono transition-colors", isDarkMode ? "text-zinc-600 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900")}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
