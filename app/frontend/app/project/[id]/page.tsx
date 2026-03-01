'use client';

import { ActionItemsList } from '@/components/roadmap/ActionItemsList';
import { PlanningTimeline } from '@/components/roadmap/PlanningTimeline';
import { DependencyGraph } from '@/components/roadmap/DependencyGraph';
import { RoadmapRevisionInput } from '@/components/roadmap/RoadmapRevisionInput';
import { ExportButton } from '@/components/ui/ExportButton';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { SectionHeader } from '@/components/documentation/SectionHeader';
import { StatBox } from '@/components/dashboard/StatBox';
import { Badge } from '@/components/ui/Badge';
import type { Task as RoadmapTask, TaskStatus } from '@/lib/types';
import { roadmapToMarkdown } from '@/lib/types';
import { useStructure } from '@/lib/useStructure';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Activity,
    AlertCircle, 
    ArrowLeft, 
    Calendar, 
    Clock,
    History, 
    Layout,
    LayoutDashboard, 
    Lock,
    Moon,
    Network, 
    Sparkles,
    Sun,
    Target, 
    Zap, 
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

type ViewMode = 'grid' | 'graph' | 'timeline';

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
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [isDarkMode, setIsDarkMode] = useState(true);

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

    // Sync local state when roadmap changes
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
        (revision: string) => {
            void revision; // TODO: implement POST /revise
        },
        [],
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return () => document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    if (isLoading) {
        return (
            <div className={cn('min-h-screen flex items-center justify-center p-6 transition-colors', isDarkMode ? 'bg-[#09090b]' : 'bg-slate-100')}>
                <LoadingOrchestrator />
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn('min-h-screen flex items-center justify-center p-6 transition-colors', isDarkMode ? 'bg-[#09090b] text-zinc-400' : 'bg-slate-100 text-slate-600')}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn('w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6', isDarkMode ? 'bg-[#161618] border border-zinc-800' : 'bg-white border-2 border-slate-300')}
                >
                    <div className="h-20 w-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
                        <AlertCircle size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className={cn('text-2xl font-bold uppercase tracking-tight', isDarkMode ? 'text-white' : 'text-slate-900')}>System Interrupt</h2>
                        <p className={cn('italic', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>{`"${error}"`}</p>
                    </div>
                    <Link href="/dashboard" className="block">
                        <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-bold uppercase tracking-widest text-xs">
                            <ArrowLeft size={16} className="mr-2" />
                            Return to Console
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className={cn('min-h-screen flex items-center justify-center p-6 font-mono text-sm animate-pulse transition-colors', isDarkMode ? 'bg-[#09090b] text-zinc-500' : 'bg-slate-100 text-slate-600')}>
                {`> INITIALIZING NEURAL CONTEXT...`}
            </div>
        );
    }

    const markdown = roadmapToMarkdown({ ...roadmap, tasks: localTasks, planning: localPlanning });

    const viewModes: { id: ViewMode; icon: typeof Layout; label: string }[] = [
        { id: 'grid', icon: Layout, label: 'Structured View' },
        { id: 'graph', icon: Network, label: 'Neural Graph' },
        { id: 'timeline', icon: Calendar, label: 'Execution Timeline' },
    ];

    return (
        <div className={cn(
            'min-h-screen font-sans transition-colors duration-300',
            isDarkMode ? 'bg-[#09090b] text-zinc-400 selection:bg-blue-500/30' : 'bg-slate-100 text-slate-700 selection:bg-blue-200'
        )}>
            {/* Header */}
            <header className={cn(
                'sticky top-0 z-40 backdrop-blur-xl px-6 py-4 transition-colors',
                isDarkMode ? 'bg-[#09090b]/80 border-b border-zinc-800/50' : 'bg-white/90 border-b-2 border-slate-300'
            )}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/roadmaps"
                            className={cn(
                                'p-2 rounded-xl transition-colors',
                                isDarkMode ? 'hover:bg-zinc-800 text-zinc-500 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                            )}
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div className={cn('h-6 w-px', isDarkMode ? 'bg-zinc-800' : 'bg-slate-300')} />
                        <span className={cn('text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:block', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>
                            Roadmap Unit / {projectId.substring(0, 8)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={cn(
                                'p-2 rounded-xl transition-colors',
                                isDarkMode ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            )}
                            aria-label={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <div className={cn(
                            'flex rounded-xl p-1 border mr-4',
                            isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-200 border-slate-300'
                        )}>
                            {viewModes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setViewMode(mode.id)}
                                    title={mode.label}
                                    className={cn(
                                        'p-2 rounded-lg transition-all',
                                        viewMode === mode.id
                                            ? isDarkMode ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-slate-900 shadow-sm'
                                            : isDarkMode ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-600 hover:text-slate-800'
                                    )}
                                >
                                    <mode.icon size={16} />
                                </button>
                            ))}
                        </div>
                        <ExportButton
                            markdown={markdown}
                            data={{ ...roadmap, tasks: localTasks, planning: localPlanning }}
                            filename={roadmap.title.replace(/\s+/g, '-').toLowerCase()}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                
                <div className="space-y-10">
                    <SectionHeader 
                        title={roadmap.title} 
                        description="Planification stratégique multocouche. Mistral a optimisé la structure pour une exécution sans friction."
                    />

                    <div className="flex justify-end">
                        <Link
                            href="/dashboard"
                            className={cn(
                                'inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200',
                                isDarkMode
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40 hover:bg-blue-500/25 hover:border-blue-400/60 hover:text-blue-300 shadow-lg shadow-blue-500/5'
                                    : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 shadow-md'
                            )}
                        >
                            <LayoutDashboard size={18} />
                            Accéder au Dashboard
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatBox 
                            label="Neural Nodes" 
                            value={localTasks.length.toString()} 
                            detail="TASKS" 
                            icon={Zap} 
                            color="text-blue-400"
                            variant={isDarkMode ? 'dark' : 'light'}
                        />
                        <StatBox 
                            label="Integrity" 
                            value="Verified" 
                            detail="NO CYCLES" 
                            icon={Activity} 
                            color="text-emerald-400"
                            variant={isDarkMode ? 'dark' : 'light'}
                        />
                        <StatBox 
                            label="Critical Path" 
                            value="Active" 
                            detail="OPTIMIZED" 
                            icon={Network} 
                            color="text-blue-400"
                            variant={isDarkMode ? 'dark' : 'light'}
                        />
                        <StatBox 
                            label="Status" 
                            value={localPlanning ? "Scheduled" : "Draft"} 
                            detail="SYNC READY" 
                            icon={History} 
                            color="text-amber-400"
                            variant={isDarkMode ? 'dark' : 'light'}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* VIEW: Grid */}
                    {viewMode === 'grid' && (
                        <motion.div
                            key="grid-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-6">
                                <div className={cn('flex items-center gap-3 px-2 text-[10px] font-bold uppercase tracking-widest', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>
                                    <Target size={14} className="text-blue-500" />
                                    Strategic Clusters
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {roadmap.objectives.map((obj) => {
                                        const relatedTasks = localTasks.filter(t => t.objectiveId === obj.id);
                                        const doneTasks = relatedTasks.filter(t => t.status === 'done').length;
                                        const progress = relatedTasks.length > 0 ? (doneTasks / relatedTasks.length) * 100 : 0;
                                        return (
                                            <div
                                                key={obj.id}
                                                className={cn(
                                                    'rounded-4xl p-6 transition-all group',
                                                    isDarkMode
                                                        ? 'bg-[#161618] border border-zinc-800/50 hover:border-blue-500/30'
                                                        : 'bg-white border-2 border-slate-300 shadow-lg hover:border-blue-400/50 hover:shadow-xl'
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <Badge variant="status" type={progress === 100 ? 'done' : 'doing'} className="uppercase text-[8px] font-black tracking-widest">
                                                        {progress === 100 ? 'Synced' : 'Active'}
                                                    </Badge>
                                                    <span className={cn('text-[10px] font-mono italic', isDarkMode ? 'text-zinc-600' : 'text-slate-500')}>PRIORITY: {obj.priority}</span>
                                                </div>
                                                <h4 className={cn('text-lg font-bold leading-tight mb-2 transition-colors', isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600')}>{obj.text}</h4>
                                                <div className="mt-6 flex flex-col gap-1.5">
                                                    <div className={cn('flex justify-between text-[9px] font-bold uppercase', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>
                                                        <span>{doneTasks}/{relatedTasks.length} Nodes</span>
                                                        <span>{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className={cn('w-full h-1 rounded-full overflow-hidden', isDarkMode ? 'bg-zinc-800' : 'bg-slate-200')}>
                                                        <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={cn(
                                'rounded-[2.5rem] p-8 lg:p-10 shadow-2xl',
                                isDarkMode ? 'bg-[#161618] border border-zinc-800/50' : 'bg-white border-2 border-slate-300'
                            )}>
                                <ActionItemsList tasks={localTasks} onStatusChange={handleStatusChange} />
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW: Graph */}
                    {viewMode === 'graph' && (
                        <motion.div
                            key="graph-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                        >
                            <div className={cn('flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>
                                <div className="flex items-center gap-3">
                                    <Network size={14} className="text-blue-500" />
                                    Neural Dependency Logic
                                </div>
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Critical Path</span>
                                    <span className="flex items-center gap-1.5"><div className={cn('w-1.5 h-1.5 rounded-full', isDarkMode ? 'bg-zinc-700' : 'bg-slate-400')} /> Async Tasks</span>
                                </div>
                            </div>
                            <DependencyGraph tasks={localTasks} className={cn('h-[700px] shadow-2xl rounded-[2.5rem]', isDarkMode ? 'border-zinc-800/50' : 'border-2 border-slate-300')} />
                        </motion.div>
                    )}

                    {/* VIEW: Timeline (INTEGRATED) */}
                    {viewMode === 'timeline' && (
                        <motion.div
                            key="timeline-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className={cn('flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-widest', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>
                                <div className="flex items-center gap-3">
                                    <Clock size={14} className="text-amber-500" />
                                    Temporal Distribution
                                </div>
                                {localPlanning && (
                                    <span className={cn('font-mono italic', isDarkMode ? 'text-zinc-600' : 'text-slate-500')}>
                                        Span: {localPlanning.startDate} — {localPlanning.endDate}
                                    </span>
                                )}
                            </div>

                            {localPlanning ? (
                                <div className={cn(
                                    'rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden',
                                    isDarkMode ? 'bg-[#161618] border border-zinc-800/50' : 'bg-white border-2 border-slate-300'
                                )}>
                                    <PlanningTimeline
                                        planning={localPlanning}
                                        tasks={localTasks}
                                        onToggleSlot={handleToggleSlot}
                                        className="relative z-10"
                                    />
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                                        <Calendar size={400} />
                                    </div>
                                </div>
                            ) : (
                                <div className={cn(
                                    'border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6',
                                    isDarkMode ? 'bg-[#161618] border border-zinc-800/50' : 'bg-white border-2 border-slate-300'
                                )}>
                                    <div className="h-20 w-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500">
                                        <Lock size={32} />
                                    </div>
                                    <div className="space-y-2 max-w-sm">
                                        <h3 className={cn('text-xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>Timeline Not Initialized</h3>
                                        <p className={cn('text-sm italic leading-relaxed', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>
                                            Mistral n&apos;a pas généré de planification temporelle pour ce dump. Demandez-lui une révision ci-dessous.
                                        </p>
                                    </div>
                                    <Button onClick={() => handleRevision("Génère une planification temporelle pour cette roadmap")} className="bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase text-[10px] tracking-widest px-8">
                                        <Sparkles size={14} className="mr-2" /> Initialize Timeline
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Revision */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={cn('max-w-2xl mx-auto pt-12', isDarkMode ? 'border-t border-zinc-800/50' : 'border-t-2 border-slate-300')}
                >
                    <div className="text-center mb-8 space-y-2">
                        <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                            <Sparkles size={20} />
                        </div>
                        <h3 className={cn('text-xl font-bold uppercase tracking-tight italic', isDarkMode ? 'text-white' : 'text-slate-900')}>Neural Refinement</h3>
                        <p className={cn('text-xs', isDarkMode ? 'text-zinc-500' : 'text-slate-600')}>Dialoguez avec l&apos;IA pour ajuster les délais, fusionner des tâches ou extraire de nouveaux objectifs.</p>
                    </div>
                    <RoadmapRevisionInput onUpdate={handleRevision} />
                </motion.section>
            </main>

            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
