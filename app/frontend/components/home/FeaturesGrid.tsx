'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Mic, Network, RefreshCcw } from 'lucide-react';

const featureKeys = [
  { number: '01', key: 'voiceToTask' as const, icon: Mic },
  { number: '02', key: 'neuralMapping' as const, icon: Network },
  { number: '03', key: 'iterativeRefine' as const, icon: RefreshCcw },
];

export function FeaturesGrid() {
  const t = useTranslations('features');
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 w-full pt-4">
      {featureKeys.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.number} className="text-left space-y-2 sm:space-y-3">
            <div className="flex items-center gap-3">
              <Icon size={18} className="sm:w-5 sm:h-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {f.number}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight underline decoration-blue-600 dark:decoration-blue-400 decoration-2 underline-offset-4">
              {t(`${f.key}`)}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">{t(`${f.key}Desc`)}</p>
          </div>
        );
      })}
    </div>
  );
}
