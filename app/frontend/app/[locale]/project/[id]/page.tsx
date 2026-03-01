'use client';

import { ActionItemsList } from '@/components/roadmap/ActionItemsList';
import { PlanningTimeline } from '@/components/roadmap/PlanningTimeline';
import { DependencyGraph } from '@/components/roadmap/DependencyGraph';
import { RoadmapRevisionInput } from '@/components/roadmap/RoadmapRevisionInput';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { SectionHeader } from '@/components/documentation/SectionHeader';
import { StatBox } from '@/components/dashboard/StatBox';
import { ProjectHeader } from '@/components/roadmap/ProjectHeader';
import { ObjectiveGrid } from '@/components/roadmap/ObjectiveGrid';

import type { Task as RoadmapTask, TaskStatus } from '@/lib/types';
import { roadmapToMarkdown } from '@/lib/types';
import { useStructure } from '@/lib/useStructure';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Zap,
  History,
  Network,
  Activity,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ProjectPage() {
  const locale = useLocale();
  const t = useTranslations('projectPage');
  const tExport = useTranslations('exportMarkdown');
  const params = useParams();
  const projectId = params.id as string;

  const { roadmap, isLoading, error, fetchProject } = useStructure();

  const lastFetchedProjectId = useRef<string | null>(null);
  const [localTasks, setLocalTasks] = useState<RoadmapTask[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'graph' | 'timeline'>('grid');

  useEffect(() => {
    if (lastFetchedProjectId.current === projectId) return;
    lastFetchedProjectId.current = projectId;
    fetchProject(projectId);
  }, [projectId, fetchProject]);

  const [localPlanning, setLocalPlanning] = useState(roadmap?.planning);
  useEffect(() => {
    if (!roadmap) return;
    setLocalTasks(roadmap.tasks ?? []);
    setLocalPlanning(roadmap.planning);
  }, [roadmap]);

  const handleStatusChange = useCallback((id: string, newStatus: TaskStatus) => {
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }, []);

  const handleToggleSlot = useCallback(
    (taskId: string, day: string, slot: 'AM' | 'PM') => {
      setLocalPlanning((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          slots: prev.slots.map((s) =>
            s.taskId === taskId && s.day === day && s.slot === slot
              ? { ...s, done: !s.done }
              : s
          ),
        };
      });
    },
    []
  );

  const handleRevision = useCallback((_revision: string) => {}, []);

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center p-6 text-slate-700 dark:text-zinc-400 transition-colors duration-300">
        <LoadingOrchestrator />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center p-6 text-slate-700 dark:text-zinc-400 transition-colors duration-300">
        <div className="w-full max-w-lg bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
          <AlertCircle size={40} className="text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {t('systemInterrupt')}
          </h2>
          <p className="text-slate-600 dark:text-zinc-500 italic">&quot;{error}&quot;</p>
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase text-xs h-12 rounded-xl">
              {t('returnToConsole')}
            </Button>
          </Link>
        </div>
      </div>
    );

  if (!roadmap)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center p-6 font-mono text-xs text-slate-500 dark:text-zinc-600 animate-pulse transition-colors duration-300">
        {`> ${t('initializingNeuralContext')}`}
      </div>
    );

  const markdown = roadmapToMarkdown(
    {
      ...roadmap,
      tasks: localTasks,
      planning: localPlanning,
    },
    {
      locale: locale === 'fr' ? 'fr-FR' : 'en-US',
      labels: {
        generatedOn: tExport('generatedOn'),
        objectives: tExport('objectives'),
        tasks: tExport('tasks'),
        tableTask: tExport('tableTask'),
        tablePriority: tExport('tablePriority'),
        tableEstimate: tExport('tableEstimate'),
        tableStatus: tExport('tableStatus'),
        tableDependencies: tExport('tableDependencies'),
        planning: tExport('planning'),
        fromTo: tExport('fromTo'),
      },
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-700 dark:text-zinc-400 font-sans selection:bg-blue-200 dark:selection:bg-violet-500/30 transition-colors duration-300">
      <ProjectHeader
        projectId={projectId}
        roadmapTitle={roadmap.title}
        viewMode={viewMode}
        setViewMode={setViewMode}
        markdown={markdown}
        roadmapData={{ ...roadmap, tasks: localTasks, planning: localPlanning }}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="space-y-10">
          <SectionHeader
            title={roadmap.title}
            description={t('sectionDescription')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox
              label={t('nodes')}
              value={localTasks.length.toString()}
              detail={t('tasks')}
              icon={Zap}
              color="text-violet-400"
            />
            <StatBox
              label={t('integrity')}
              value={t('verified')}
              detail={t('noCycles')}
              icon={Activity}
              color="text-emerald-400"
            />
            <StatBox
              label={t('path')}
              value={t('active')}
              detail={t('optimized')}
              icon={Network}
              color="text-blue-400"
            />
            <StatBox
              label={t('status')}
              value={localPlanning ? t('scheduled') : t('draft')}
              detail={t('syncReady')}
              icon={History}
              color="text-amber-400"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <ObjectiveGrid objectives={roadmap.objectives} tasks={localTasks} />
              <div className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                <ActionItemsList
                  tasks={localTasks}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </motion.div>
          )}

          {viewMode === 'graph' && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <DependencyGraph
                tasks={localTasks}
                className="h-[700px] border-slate-200 dark:border-zinc-800/50 shadow-2xl rounded-[2.5rem]"
              />
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {localPlanning ? (
                <div className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                  <PlanningTimeline
                    planning={localPlanning}
                    tasks={localTasks}
                    onToggleSlot={handleToggleSlot}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-zinc-800/50 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
                  <Lock size={32} className="text-amber-500" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                    {t('timelineNotInitialized')}
                  </h3>
                  <Button
                    onClick={() => handleRevision(t('generatePlanningPrompt'))}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl"
                  >
                    {t('initializeTimeline')}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto pt-12 border-t border-slate-200 dark:border-zinc-800/50 text-center space-y-8"
        >
          <div className="h-10 w-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 mx-auto">
            <Sparkles size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight italic leading-none">
            {t('neuralRefinement')}
          </h3>
          <RoadmapRevisionInput onUpdate={handleRevision} />
        </motion.section>
      </main>

      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
