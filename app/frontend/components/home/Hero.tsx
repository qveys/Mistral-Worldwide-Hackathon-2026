'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Zap } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white dark:bg-zinc-800/80 border-2 border-slate-300 dark:border-zinc-600 text-slate-500 dark:text-zinc-400 text-[10px] sm:text-sm font-bold uppercase tracking-widest shadow-sm">
        <Zap size={14} className="sm:w-4 sm:h-4 shrink-0 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
        <span className="truncate max-w-[200px] sm:max-w-none">{t('poweredBy')}</span>
      </div>
      
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-medium tracking-tight text-slate-900 dark:text-white leading-[0.9] sm:leading-[0.85] px-1">
        {t('headlinePrefix')}{' '}
        <span className="italic font-serif text-blue-600 dark:text-blue-400">{t('headlineEmphasis')}</span>
      </h1>
      
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light text-balance px-2">
        {t.rich('subtitle', {
          br: () => <br className="hidden sm:block" />,
        })}
      </p>
    </div>
  );
}
