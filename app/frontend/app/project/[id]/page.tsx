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
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    AlertCircle, 
    ArrowLeft, 
    Zap, 
    Calendar, 
    History, 
    Network, 
    Activity,
    Sparkles,
    Clock,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function ProjectPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id as string;
    const textParam = searchParams.get('text');
    const planningParam = searchParams.get('planning') === '1';

    const { roadmap, isLoading, error, structureBrainDump, fetchProject } =
        useStructure();

    const hasStarted = useRef(false);
    const [localTasks, setLocalTasks] = useState<RoadmapTask[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'graph' | 'timeline'>('grid');

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;
        if (textParam) {
            structureBrainDump(textParam, planningParam);
        } else {
            fetchProject(projectId);
        }
    }, [textParam, planningParam, projectId, structureBrainDump, fetchProject]);

    const [localPlanning, setLocalPlanning] = useState(roadmap?.planning);
    const [prevRoadmap, setPrevRoadmap] = useState(roadmap);

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

    const handleRevision = useCallback((_revision: string) => {}, []);

    if (isLoading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-zinc-400">
            <LoadingOrchestrator />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-zinc-400">
            <div className="w-full max-w-lg bg-[#161618] border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6">
                <AlertCircle size={40} className="text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">System Interrupt</h2>
                <p className="text-zinc-500 italic">"{error}"</p>
                <Link href="/dashboard" className="block">
                    <Button className="w-full bg-white text-black font-bold uppercase text-xs h-12 rounded-xl">Return to Console</Button>
                </Link>
            </div>
        </div>
    );

    if (!roadmap) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 font-mono text-xs text-zinc-600 animate-pulse">
            {`> INITIALIZING NEURAL CONTEXT...`}
        </div>
    );

    const markdown = roadmapToMarkdown({ ...roadmap, tasks: localTasks, planning: localPlanning });

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans selection:bg-violet-500/30">
            
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
                    <SectionHeader title={roadmap.title} description="Planification stratégique multicouche optimisée par Mistral." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatBox label="Nodes" value={localTasks.length.toString()} detail="TASKS" icon={Zap} color="text-violet-400" />
                        <StatBox label="Integrity" value="Verified" detail="NO CYCLES" icon={Activity} color="text-emerald-400" />
                        <StatBox label="Path" value="Active" detail="OPTIMIZED" icon={Network} color="text-blue-400" />
                        <StatBox label="Status" value={localPlanning ? "Scheduled" : "Draft"} detail="SYNC READY" icon={History} color="text-amber-400" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'grid' && (
                        <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                            <ObjectiveGrid objectives={roadmap.objectives} tasks={localTasks} />
                            <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl">
                                <ActionItemsList tasks={localTasks} onStatusChange={handleStatusChange} />
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'graph' && (
                        <motion.div key="graph" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                            <DependencyGraph tasks={localTasks} className="h-[700px] border-zinc-800/50 shadow-2xl rounded-[2.5rem]" />
                        </motion.div>
                    )}

                    {viewMode === 'timeline' && (
                        <motion.div key="timeline" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                            {localPlanning ? (
                                <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                                    <PlanningTimeline planning={localPlanning} tasks={localTasks} onToggleSlot={handleToggleSlot} />
                                </div>
                            ) : (
                                <div className="bg-[#161618] border border-zinc-800/50 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
                                    <Lock size={32} className="text-amber-500" />
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Timeline Not Initialized</h3>
                                    <Button onClick={() => handleRevision("Génère un planning")} className="bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase text-[10px] tracking-widest px-8 h-12 rounded-xl">Initialize Timeline</Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-2xl mx-auto pt-12 border-t border-zinc-800/50 text-center space-y-8">
                    <div className="h-10 w-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 mx-auto">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight italic leading-none">Neural Refinement</h3>
                    <RoadmapRevisionInput onUpdate={handleRevision} />
                </motion.section>
            </main>

            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
