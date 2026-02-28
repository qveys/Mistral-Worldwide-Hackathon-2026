'use client';

import { ActionItemsList } from '@/components/roadmap/ActionItemsList';
import { PlanningTimeline } from '@/components/roadmap/PlanningTimeline';
import { RoadmapCanvas, RoadmapItem } from '@/components/roadmap/RoadmapCanvas';
import { RoadmapRevisionInput } from '@/components/roadmap/RoadmapRevisionInput';
import { ExportButton } from '@/components/ui/ExportButton';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import type { Task as RoadmapTask, TaskStatus } from '@/lib/types';
import { roadmapToMarkdown } from '@/lib/types';
import { useStructure } from '@/lib/useStructure';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ProjectPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id as string;
    const textParam = searchParams.get('text');
    const planningParam = searchParams.get('planning') === '1';

    const { roadmap, isLoading, error, activeStep, structureBrainDump, fetchProject, setRoadmap } =
        useStructure();

    const hasStarted = useRef(false);
    const [localTasks, setLocalTasks] = useState<RoadmapTask[]>([]);

    // On mount: either structure from text param, or fetch existing project
    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        if (textParam) {
            structureBrainDump(textParam, planningParam);
        } else {
            fetchProject(projectId);
        }
    }, [textParam, planningParam, projectId, structureBrainDump, fetchProject]);

    // Local planning state for toggling slots
    const [localPlanning, setLocalPlanning] = useState(roadmap?.planning);
    const [prevRoadmap, setPrevRoadmap] = useState(roadmap);

    // Sync local state when roadmap changes (adjusting state during render)
    if (roadmap !== prevRoadmap) {
        setPrevRoadmap(roadmap);
        if (roadmap?.tasks) setLocalTasks(roadmap.tasks);
        if (roadmap?.planning) setLocalPlanning(roadmap.planning);
    }

    const handleStatusChange = useCallback((id: string, newStatus: TaskStatus) => {
        setLocalTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    }, []);

    const handleToggleSlot = useCallback((taskId: string, day: string, slot: 'AM' | 'PM') => {
        setLocalPlanning((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                slots: prev.slots.map((s) =>
                    s.taskId === taskId && s.day === day && s.slot === slot
                        ? { ...s, done: !s.done }
                        : s,
                ),
            };
        });
    }, []);

    const handleRevision = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_revision: string) => {
            // TODO: implement POST /revise integration
            // For now, this is a placeholder
        },
        [],
    );

    // --- Render ---

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
                <LoadingOrchestrator />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-200 text-center space-y-4"
                >
                    <AlertCircle size={48} className="text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-900">Erreur</h2>
                    <p className="text-slate-600">{error}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Retour
                    </Link>
                </motion.div>
            </div>
        );
    }

    // No roadmap yet
    if (!roadmap) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
                <p className="text-slate-500">Chargement...</p>
            </div>
        );
    }

    const markdown = roadmapToMarkdown({ ...roadmap, tasks: localTasks, planning: localPlanning });

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-slate-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{roadmap.title}</h1>
                            <p className="text-xs text-slate-500">
                                {roadmap.objectives.length} objectifs · {localTasks.length} tâches
                                {localPlanning
                                    ? ` · Planning ${localPlanning.startDate} → ${localPlanning.endDate}`
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <ExportButton
                        markdown={markdown}
                        data={{ ...roadmap, tasks: localTasks, planning: localPlanning }}
                        filename={roadmap.title.replace(/\s+/g, '-').toLowerCase()}
                    />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
                <AnimatePresence>
                    {/* Objectives */}
                    <motion.section
                        key="objectives"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <RoadmapCanvas title="Objectifs">
                            {roadmap.objectives.map((obj) => {
                                const relatedTasks = localTasks.filter(
                                    (t) => t.objectiveId === obj.id,
                                );
                                const doneTasks = relatedTasks.filter(
                                    (t) => t.status === 'done',
                                ).length;
                                const status =
                                    doneTasks === relatedTasks.length && relatedTasks.length > 0
                                        ? 'done'
                                        : doneTasks > 0
                                          ? 'in-progress'
                                          : 'todo';
                                return (
                                    <RoadmapItem
                                        key={obj.id}
                                        title={obj.text}
                                        description={`${relatedTasks.length} tâches · ${doneTasks} complétées`}
                                        period={obj.priority}
                                        status={status as 'todo' | 'in-progress' | 'done'}
                                    />
                                );
                            })}
                        </RoadmapCanvas>
                    </motion.section>

                    {/* Tasks */}
                    <motion.section
                        key="tasks"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <ActionItemsList tasks={localTasks} onStatusChange={handleStatusChange} />
                    </motion.section>

                    {/* Planning Timeline (if present) */}
                    {localPlanning && (
                        <motion.section
                            key="planning"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={cn(
                                'bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20',
                            )}
                        >
                            <PlanningTimeline
                                planning={localPlanning}
                                tasks={localTasks}
                                onToggleSlot={handleToggleSlot}
                            />
                        </motion.section>
                    )}

                    {/* Revision Input */}
                    <motion.section
                        key="revision"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <RoadmapRevisionInput onUpdate={handleRevision} />
                    </motion.section>
                </AnimatePresence>
            </main>
        </div>
    );
}
