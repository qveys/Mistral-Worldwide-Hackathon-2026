'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Zap } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home');
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border-2 border-slate-300 text-slate-500 text-sm font-bold uppercase tracking-widest shadow-sm">
        <Zap size={16} className="text-blue-600 fill-blue-600" />
        {t('poweredBy')}
      </div>
      
      <h1 className="text-7xl md:text-9xl font-medium tracking-tight text-slate-900 leading-[0.85]">
        Chaos to <span className="italic font-serif text-blue-600">Clarity.</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light text-balance">
        {t('subtitle')}
      </p>
    </div>
  );
}
