'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MousePointer2, Command } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';

export const FoundationSection = () => {
  const t = useTranslations('doc');
  const tTask = useTranslations('taskCard');
  return (
  <motion.div key="foundation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    <SectionHeader title={t('designSystem')} description={t('sectionDesignSystemDescription')} />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-[2.5rem] p-8 space-y-8 shadow-lg dark:shadow-xl">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400"><MousePointer2 size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">{t('atomsUi')}</span></div>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">{t('primaryBtn')}</Button>
          <Button variant="secondary">{t('secondaryBtn')}</Button>
          <Button variant="danger">{t('dangerBtn')}</Button>
          <Button variant="primary" isLoading>{t('waitBtn')}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="priority" type="high">{tTask('priorityHigh')}</Badge>
          <Badge variant="status" type="doing">{tTask('inProgress')}</Badge>
          <Badge variant="estimate">{t('sizeLabel')}: M</Badge>
          <Spinner size="md" className="text-blue-600 dark:text-blue-400 ml-2" />
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-[2.5rem] p-8 space-y-6 shadow-lg dark:shadow-xl">
        <div className="flex items-center gap-2 text-blue-500"><Command size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">{t('formLabel')}</span></div>
        <Input label={t('roadmapName')} placeholder={t('roadmapNamePlaceholder')} />
        <Input label={t('emailLabel')} placeholder={t('emailPlaceholder')} error={t('emailInvalid')} />
      </div>
    </div>
  </motion.div>
  );
};
