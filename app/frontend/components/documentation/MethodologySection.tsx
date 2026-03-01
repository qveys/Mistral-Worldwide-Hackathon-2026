'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/Card';
import { Mic, Brain, Network, Layout, CheckCircle2, ArrowRight } from 'lucide-react';

export const MethodologySection = () => {
  const t = useTranslations('doc');
  const steps = [
    { icon: Mic, titleKey: 'stepCaptureTitle' as const, descKey: 'stepCaptureDesc' as const, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Brain, titleKey: 'stepIntelligenceTitle' as const, descKey: 'stepIntelligenceDesc' as const, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Network, titleKey: 'stepGraphTitle' as const, descKey: 'stepGraphDesc' as const, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Layout, titleKey: 'stepVizTitle' as const, descKey: 'stepVizDesc' as const, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];
  return (
  <motion.div 
    key="methodology" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }}
    className="space-y-12"
  >
    <SectionHeader 
      title={t('methodologyTitle')} 
      description={t('sectionMethodologyDescription')} 
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {steps.map((step, index) => (
        <Card key={index} className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-lg dark:shadow-xl flex flex-col gap-6 relative group overflow-hidden">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <step.icon size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{t('stepLabel')} 0{index + 1}</span>
              <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white leading-tight font-bold">{t(step.titleKey)}</h3>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
            {t(step.descKey)}
          </p>
          <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {t('technicalDetails')} <ArrowRight size={12} />
          </div>
          <div className="absolute top-0 right-0 p-8 text-8xl font-black italic text-slate-100 dark:text-white/5 -z-10 group-hover:-translate-y-2 transition-transform">
            0{index + 1}
          </div>
        </Card>
      ))}
    </div>

    {/* Philosophy Box */}
    <div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
      <div className="relative z-10 space-y-4 max-w-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-tight">{t('philosophyTitle')}</h3>
        <p className="text-lg font-medium opacity-90 leading-relaxed">
          {t('philosophyBody')}
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          {([t('simplicity'), t('speed'), t('clarity'), t('action')] as const).map((v) => (
            <div key={v} className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={14} /> {v}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -right-20 -bottom-20 opacity-10">
        <Brain size={400} />
      </div>
    </div>
  </motion.div>
  );
};
