'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { RoadmapCanvas } from '@/components/roadmap/RoadmapCanvas';
import { DependencyGraph } from '@/components/roadmap/DependencyGraph';
import { ObjectiveCard } from '@/components/roadmap/ObjectiveCard';
import { TaskCard, Task } from '@/components/ui/TaskCard';
import { cn } from '@/lib/utils';
import { MOCK_ROADMAP } from './constants';

interface StrategySectionProps {
  roadmapViewMode: 'timeline' | 'graph';
  setRoadmapViewMode: (mode: 'timeline' | 'graph') => void;
  tasks: Task[];
}

export const StrategySection = ({
  roadmapViewMode,
  setRoadmapViewMode,
  tasks
}: StrategySectionProps) => {
  const t = useTranslations('doc');
  return (
  <motion.div key="strategy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    <SectionHeader title={t('sectionStrategyTitle')} description={t('sectionStrategyDescription')} />
    
    <div className="space-y-12">
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-[3rem] overflow-hidden shadow-lg dark:shadow-xl h-[600px] relative">
        <div className="absolute top-6 right-6 z-10 flex bg-white dark:bg-slate-700 p-1 rounded-xl border-2 border-slate-300 dark:border-slate-500">
          <button onClick={() => setRoadmapViewMode('timeline')} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", roadmapViewMode === 'timeline' ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md" : "text-slate-400")}>{t('viewTimelineLabel')}</button>
          <button onClick={() => setRoadmapViewMode('graph')} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", roadmapViewMode === 'graph' ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md" : "text-slate-400")}>{t('viewGraphLabel')}</button>
        </div>
        {roadmapViewMode === 'timeline' ? (
          <RoadmapCanvas roadmap={MOCK_ROADMAP} className="h-full p-12" />
        ) : (
          <DependencyGraph tasks={tasks} className="h-full border-none rounded-none bg-transparent" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <ObjectiveCard title={t('migrationStrategy')} priority="high" tasks={tasks} />
        <div className="space-y-4">
          <TaskCard task={{ id: 't1', title: t('demoServerConfig'), status: 'doing', priority: 'high', estimate: 'M' }} onStatusChange={() => {}} />
          <TaskCard task={{ id: 't2', title: t('demoFrontendDeploy'), status: 'backlog', priority: 'medium', estimate: 'L' }} isBlocked blockedBy={[t('demoValidationDns')]} onStatusChange={() => {}} />
        </div>
      </div>
    </div>
  </motion.div>
  );
};
