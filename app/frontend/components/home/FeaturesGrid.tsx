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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-4">
      {featureKeys.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.number} className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-blue-600" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                {f.number}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight underline decoration-blue-600 decoration-2 underline-offset-4">
              {t(`${f.key}`)}
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">{t(`${f.key}Desc`)}</p>
          </div>
        );
      })}
    </div>
  );
}
