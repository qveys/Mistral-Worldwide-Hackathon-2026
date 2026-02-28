'use client';

import { BrainDumpInput } from '@/components/brain-dump/BrainDumpInput';
import { TranscriptionLiveView } from '@/components/brain-dump/TranscriptionLiveView';
import { ClarificationBubble } from '@/components/brain-dump/ClarificationBubble';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ActionItemsList } from '@/components/roadmap/ActionItemsList';
import { RoadmapCanvas, Roadmap } from '@/components/roadmap/RoadmapCanvas';
import { DependencyGraph } from '@/components/roadmap/DependencyGraph';
import { ReviseInput } from '@/components/roadmap/ReviseInput';
import { ExportButton } from '@/components/ui/ExportButton';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { MicButton, MicButtonState } from '@/components/ui/MicButton';
import { Task, TaskCard, TaskStatus } from '@/components/ui/TaskCard';
import { Toast, ToastType } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { ObjectiveCard } from '@/components/roadmap/ObjectiveCard';
import { cn } from '@/lib/utils';
import { Home, Moon, Sparkles, Sun, Bug, CheckCircle2, AlertCircle, Brain, Layout, Download, AlertOctagon, Network, Layers, Zap, MousePointer2, ChevronRight, Component, Command, Terminal, Box } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DocCategory = 'foundation' | 'capture' | 'strategy' | 'system';

export default function DocumentationPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeCategory, setActiveCategory] = useState<DocCategory>('foundation');
    const [roadmapViewMode, setRoadmapViewMode] = useState<'timeline' | 'graph'>('timeline');
    const [micState, setMicState] = useState<MicButtonState>('idle');
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);
    const [simulateSTTError, setSimulateSTTError] = useState(false);
    const [shouldCrash, setShouldCrash] = useState(false);

    // Mock Data
    const mockRoadmap = useMemo<Roadmap>(() => ({
      id: 'demo-roadmap',
      title: 'EchoMaps Launch Plan',
      objectives: [
        { id: 'obj-1', title: 'Core Infrastructure', color: 'blue' },
        { id: 'obj-2', title: 'Product Launch', color: 'orange' }
      ],
      timeSlots: [
        {
          day: 1, period: 'AM',
          tasks: [
            { id: 'rt-1', title: 'Setup Cloud Infrastructure', status: 'done', priority: 'high', estimate: 'L', objectiveId: 'obj-1' },
            { id: 'rt-2', title: 'Database Schema Design', status: 'doing', priority: 'medium', estimate: 'M', objectiveId: 'obj-1', dependencies: ['rt-1'] }
          ]
        },
        {
          day: 1, period: 'PM',
          tasks: [
            { id: 'rt-3', title: 'Authentication Service', status: 'backlog', priority: 'high', estimate: 'M', objectiveId: 'obj-1', dependencies: ['rt-2'] }
          ]
        }
      ]
    }), []);

    const allTasks: Task[] = mockRoadmap.timeSlots.flatMap(slot => slot.tasks);
    const [tasks, setTasks] = useState<Task[]>(allTasks);

    const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({ isVisible: false, message: '', type: 'success' });
    const showToast = (message: string, type: ToastType) => setToast({ isVisible: true, message, type });

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const navItems = [
        { id: 'foundation', label: 'Design System', icon: Layers, desc: 'Atomes & Formulaires' },
        { id: 'capture', label: 'Brain Dump', icon: Brain, desc: 'Voix & Saisie Hybride' },
        { id: 'strategy', label: 'Intelligence', icon: Network, desc: 'Roadmap & Graphes' },
        { id: 'system', label: 'Infrastructure', icon: Zap, desc: 'Feedback & Résilience' },
    ];

    return (
        <div className={cn('min-h-screen flex transition-colors duration-500', isDarkMode ? 'dark bg-[#0a0a0a]' : 'bg-[#fafafa]')}>
            <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast(p => ({ ...p, isVisible: false }))} />
            <ClarificationBubble isVisible={isBubbleVisible} question="Est-ce un projet solo ou en équipe ?" onReply={() => setIsBubbleVisible(false)} onIgnore={() => setIsBubbleVisible(false)} />

            {/* --- SIDEBAR --- */}
            <aside className="w-80 h-screen sticky top-0 border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl p-6 flex flex-col gap-8 z-20">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 bg-[#ff4f00] rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <Box size={18} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-tighter italic dark:text-white">EchoMaps <span className="text-[#ff4f00]">UI</span></h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Documentation</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Composants</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveCategory(item.id as DocCategory)}
                            className={cn(
                                "w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group",
                                activeCategory === item.id 
                                    ? "bg-[#ff4f00] text-white shadow-xl shadow-orange-500/20 scale-[1.02]" 
                                    : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400"
                            )}
                        >
                            <item.icon size={18} className={cn("mt-0.5", activeCategory === item.id ? "text-white" : "text-slate-400 dark:text-slate-600 group-hover:text-[#ff4f00]")} />
                            <div className="flex flex-col">
                                <span className="font-black uppercase tracking-tighter italic text-[11px]">{item.label}</span>
                                <span className={cn("text-[9px] font-medium opacity-70 leading-none mt-1", activeCategory === item.id ? "text-orange-50" : "text-slate-400")}>{item.desc}</span>
                            </div>
                            {activeCategory === item.id && <ChevronRight size={14} className="ml-auto mt-1" />}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 group">
                        <Home size={18} className="group-hover:text-[#ff4f00]" />
                        <span className="text-xs font-bold uppercase tracking-widest">Retour Accueil</span>
                    </Link>
                    <button onClick={toggleDarkMode} className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-600 dark:text-slate-300">
                        <span className="text-[10px] font-black uppercase tracking-widest">{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* DESIGN SYSTEM */}
                        {activeCategory === 'foundation' && (
                            <motion.div key="foundation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">Design <span className="text-[#ff4f00]">System</span></h2>
                                    <p className="text-slate-500 font-medium max-w-2xl">Atomes et fondations graphiques de l&apos;interface.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                                        <div className="flex items-center gap-2 text-[#ff4f00]"><MousePointer2 size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">Atomes UI</span></div>
                                        <div className="flex flex-wrap gap-4">
                                            <Button variant="primary">Principal</Button>
                                            <Button variant="secondary">Secondaire</Button>
                                            <Button variant="danger">Danger</Button>
                                            <Button variant="primary" isLoading>Wait</Button>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Badge variant="priority" type="high">Urgent</Badge>
                                            <Badge variant="status" type="doing">In Progress</Badge>
                                            <Badge variant="estimate">Size: M</Badge>
                                            <Spinner size="md" className="text-[#ff4f00] ml-2" />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                                        <div className="flex items-center gap-2 text-indigo-500"><Command size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">Formulaire</span></div>
                                        <Input label="Roadmap Name" placeholder="Ex: Launch Project" />
                                        <Input label="Email" placeholder="user@echo.maps" error="Email invalide" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* BRAIN DUMP */}
                        {activeCategory === 'capture' && (
                            <motion.div key="capture" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">Brain <span className="text-[#ff4f00]">Dump</span></h2>
                                    <p className="text-slate-500 font-medium max-w-2xl">Capture de la pensée par la voix et le texte.</p>
                                </div>

                                <div className="space-y-8">
                                    {/* COMPACT VOICE SHOWCASE */}
                                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 flex items-center gap-10 shadow-lg">
                                        <div className="flex-shrink-0 flex flex-col items-center gap-3 pr-10 border-r border-slate-100 dark:border-white/5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff4f00] italic">Live Mic</span>
                                            <MicButton state={micState} onClick={() => setMicState(micState === 'idle' ? 'recording' : 'idle')} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-black uppercase italic dark:text-white mb-2">Transcription Live</h3>
                                            <TranscriptionLiveView text="L'IA capture vos paroles pour structurer la roadmap..." isRecording={micState === 'recording'} className="bg-transparent p-0 border-none shadow-none min-h-0" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-4 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">Brain Dump Engine</span>
                                                <button onClick={() => setSimulateSTTError(!simulateSTTError)} className={cn("px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all", simulateSTTError ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500")}>Simuler Timeout</button>
                                            </div>
                                            <BrainDumpInput onGenerate={() => {}} />
                                        </div>
                                        <div className="flex flex-col items-center justify-center p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-500/10 text-center gap-4">
                                            <button onClick={() => setIsBubbleVisible(true)} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase italic shadow-xl hover:scale-105 transition-all">Bulle Clarification</button>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-tight">Interaction contextuelle en cas d&apos;ambiguïté.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* INTELLIGENCE */}
                        {activeCategory === 'strategy' && (activeCategory === 'strategy') && (
                            <motion.div key="strategy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">Intelligence <span className="text-[#ff4f00]">Visuals</span></h2>
                                    <p className="text-slate-500 font-medium max-w-2xl">Plan d&apos;exécution généré et graphe de dépendances.</p>
                                </div>

                                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl h-[600px] relative">
                                    <div className="absolute top-6 right-6 z-10 flex bg-white/80 dark:bg-black/40 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-white/10">
                                        <button onClick={() => setRoadmapViewMode('timeline')} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", roadmapViewMode === 'timeline' ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md" : "text-slate-400")}>Timeline</button>
                                        <button onClick={() => setRoadmapViewMode('graph')} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", roadmapViewMode === 'graph' ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-md" : "text-slate-400")}>Graphe</button>
                                    </div>
                                    {roadmapViewMode === 'timeline' ? <RoadmapCanvas roadmap={mockRoadmap} className="h-full p-12" /> : <DependencyGraph tasks={tasks} className="h-full border-none rounded-none" />}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <ObjectiveCard title="Migration Strategy" priority="high" tasks={tasks} />
                                    <div className="space-y-4">
                                        <TaskCard task={{ id: 't1', title: "Configuration Serveur", status: 'doing', priority: 'high', estimate: 'M' }} onStatusChange={() => {}} />
                                        <TaskCard task={{ id: 't2', title: "Déploiement Frontend", status: 'backlog', priority: 'medium', estimate: 'L' }} isBlocked blockedBy={["Validation DNS"]} onStatusChange={() => {}} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* INFRASTRUCTURE */}
                        {activeCategory === 'system' && (
                            <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">Infrastructure <span className="text-[#ff4f00]">& Feedback</span></h2>
                                    <p className="text-slate-500 font-medium max-w-2xl">Gestion des états système et de la résilience.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                    <div className="md:col-span-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff4f00] mb-6 block">Latency Orchestrator</span>
                                        <LoadingOrchestrator className="max-w-none shadow-none border-none p-0 bg-transparent" />
                                    </div>
                                    <div className="md:col-span-4 space-y-6">
                                        {/* COMPACT RESILIENCE */}
                                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 space-y-4 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase italic text-red-500">Resilience</span>
                                                <button onClick={() => setShouldCrash(!shouldCrash)} className={cn("px-2 py-1 rounded-lg text-[8px] font-black uppercase border transition-all", shouldCrash ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "border-red-500/20 text-red-500 hover:bg-red-500/10")}>{shouldCrash ? "Reset" : "Crash UI"}</button>
                                            </div>
                                            <AnimatePresence mode="wait">
                                                {shouldCrash ? (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                        <ErrorBoundary fallback={<div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-bold text-center border border-red-100 dark:border-red-900/30">Erreur Interceptée</div>}><div className="hidden">{(() => { if (shouldCrash) throw new Error("!"); })()}</div></ErrorBoundary>
                                                    </motion.div>
                                                ) : (
                                                    <div className="py-4 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl flex items-center justify-center gap-2 opacity-30"><CheckCircle2 size={14} className="text-green-500" /><span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Stable</span></div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-4 shadow-sm">
                                            <span className="text-[10px] font-black uppercase italic text-slate-400">Feedback & Data</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => showToast('Succès', 'success')} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Toast</button>
                                                <button onClick={() => showToast('Erreur critique', 'error')} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Error</button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
                                                <span className="text-[9px] font-black uppercase dark:text-white leading-tight">Export Package</span>
                                                <ExportButton markdown="# Mock" data={{}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
