'use client';

import { BrainDumpInput } from '@/components/brain-dump/BrainDumpInput';
import { TranscriptionLiveView } from '@/components/brain-dump/TranscriptionLiveView';
import { ClarificationBubble } from '@/components/brain-dump/ClarificationBubble';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ActionItemsList } from '@/components/roadmap/ActionItemsList';
import { RoadmapCanvas, Roadmap, RoadmapTimeSlot, RoadmapObjective, RoadmapTask } from '@/components/roadmap/RoadmapCanvas';
import { RoadmapRevisionInput } from '@/components/roadmap/RoadmapRevisionInput';
import { ReviseInput } from '@/components/roadmap/ReviseInput';
import { ExportButton } from '@/components/ui/ExportButton';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { MicButton, MicButtonState } from '@/components/ui/MicButton';
import { Task, TaskCard, TaskStatus } from '@/components/ui/TaskCard';
import { Toast, ToastType } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { ObjectiveCard } from '@/components/roadmap/ObjectiveCard';
import { cn } from '@/lib/utils';
import { BookOpen, Home, Moon, Play, Sparkles, Sun, Bug, CheckCircle2, AlertTriangle, AlertCircle, Lock, messageCircle, Brain, Layout, Download, AlertOctagon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Composant qui crash pour tester l'ErrorBoundary
function CrashingComponent() {
    throw new Error("Simulation d'un crash composant !");
    return null;
}

export default function DocumentationPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [view, setView] = useState<'flow' | 'catalog'>('flow');
    const [isLoading, setIsLoading] = useState(false);
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [micState, setMicState] = useState<MicButtonState>('idle');
    const [shouldCrash, setShouldCrash] = useState(false);
    const [isDemoBlocked, setIsDemoBlocked] = useState(true);
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);
    const [simulateSTTError, setSimulateSTTError] = useState(false);
    const lastPromptRef = useRef<string>('');

    // Mock Roadmap Data
    const mockRoadmap: Roadmap = {
      id: 'demo-roadmap',
      title: 'EchoMaps Launch Plan',
      objectives: [
        { id: 'obj-1', title: 'Core Infrastructure', color: 'blue' },
        { id: 'obj-2', title: 'Product Launch', color: 'orange' }
      ],
      timeSlots: [
        {
          day: 1,
          period: 'AM',
          tasks: [
            { id: 'rt-1', title: 'Setup Cloud Infrastructure', status: 'done', priority: 'high', estimate: 'L', objectiveId: 'obj-1' },
            { id: 'rt-2', title: 'Database Schema Design', status: 'doing', priority: 'medium', estimate: 'M', objectiveId: 'obj-1' }
          ]
        },
        {
          day: 1,
          period: 'PM',
          tasks: [
            { id: 'rt-3', title: 'Authentication Service', status: 'backlog', priority: 'high', estimate: 'M', objectiveId: 'obj-1' },
            { id: 'rt-4', title: 'Landing Page Prototype', status: 'backlog', priority: 'medium', estimate: 'S', objectiveId: 'obj-2' }
          ]
        },
        {
          day: 2,
          period: 'AM',
          tasks: [
            { id: 'rt-5', title: 'Beta Testing Group Setup', status: 'backlog', priority: 'low', estimate: 'S', objectiveId: 'obj-2', isBlocked: true, blockedBy: ['Landing Page Prototype'] }
          ]
        }
      ]
    };

    // Toast State
    const [toast, setToast] = useState<{
        isVisible: boolean;
        message: string;
        type: ToastType;
        action?: { label: string; onClick: () => void };
    }>({
        isVisible: false,
        message: '',
        type: 'success',
    });

    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            title: "Définir l'architecture backend",
            priority: 'high',
            status: 'doing',
            estimate: 'M',
        },
        {
            id: '2',
            title: 'Choisir la stack frontend',
            priority: 'medium',
            status: 'done',
            estimate: 'S',
        },
        {
            id: '3',
            title: 'Mise en place du CI/CD',
            priority: 'low',
            status: 'backlog',
            estimate: 'L',
        }
    ]);

    const showToast = (
        message: string,
        type: ToastType,
        action?: { label: string; onClick: () => void },
    ) => {
        setToast({ isVisible: true, message, type, action });
    };

    const handleStatusChange = (id: string, newStatus: TaskStatus) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
        showToast(`Tâche mise à jour : ${newStatus.toUpperCase()}`, 'success');
    };

    const handleGenerate = (text: string) => {
        lastPromptRef.current = text;
        setIsLoading(true);

        setTimeout(() => {
            const hasError = Math.random() > 0.7;
            setIsLoading(false);
            if (hasError) {
                showToast('Erreur Bedrock : Échec de la génération.', 'error', {
                    label: 'Réessayer',
                    onClick: () => handleGenerate(lastPromptRef.current),
                });
            } else {
                setShowRoadmap(true);
                showToast('Roadmap générée avec succès !', 'success');
            }
        }, 2000);
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <div
            className={cn(
                'min-h-screen transition-colors duration-500',
                isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50',
            )}
        >
            {/* Clarification Bubble Demo */}
            <ClarificationBubble 
                isVisible={isBubbleVisible}
                question="Est-ce que l'authentification doit être gérée par un service externe ou en local ?"
                onReply={(ans) => {
                    showToast(`IA a reçu : "${ans}"`, 'success');
                    setIsBubbleVisible(false);
                }}
                onIgnore={() => setIsBubbleVisible(false)}
            />

            {/* Toast Notification */}
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                action={toast.action}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className={cn(
                        'absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-opacity duration-1000',
                        isDarkMode ? 'bg-blue-900/20 opacity-40' : 'bg-blue-200 opacity-60',
                    )}
                />
                <div
                    className={cn(
                        'absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-opacity duration-1000',
                        isDarkMode ? 'bg-purple-900/20 opacity-40' : 'bg-purple-200 opacity-60',
                    )}
                />
            </div>

            <div className="relative z-10 p-8 space-y-12 max-w-6xl mx-auto">
                {/* Navbar */}
                <nav className="flex justify-between items-center bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 p-4 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-blue-600 hover:bg-white/20 dark:hover:bg-black/40 transition-all duration-300 transform hover:scale-105"
                        >
                            <Home size={18} />
                            Home
                        </Link>
                        <div className="h-6 w-[1px] bg-white/10 mx-2" />
                        <button
                            onClick={() => setView('flow')}
                            className={cn(
                                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform',
                                view === 'flow'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100'
                                    : 'text-slate-500 hover:bg-white/20 dark:hover:bg-black/40 hover:scale-105',
                            )}
                        >
                            <Play size={18} />
                            Live Preview
                        </button>
                        <button
                            onClick={() => setView('catalog')}
                            className={cn(
                                'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform',
                                view === 'catalog'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100'
                                    : 'text-slate-500 hover:bg-white/20 dark:hover:bg-black/40 hover:scale-105',
                            )}
                        >
                            <BookOpen size={18} />
                            Documentation
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-3 bg-white/20 dark:bg-black/40 rounded-xl border border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:scale-110 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </nav>

                {view === 'flow' ? (
                    <section className="space-y-12">
                        <header className="text-center space-y-4">
                            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight italic text-balance">
                                Roadmap{' '}
                                <span className="text-blue-600 uppercase not-italic">
                                    Architect
                                </span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
                                Interface de travail complète (Preview)
                            </p>
                        </header>

                        <div className="space-y-6">
                            <BrainDumpInput onGenerate={handleGenerate} isProcessing={isLoading} />
                        </div>

                        {isLoading && (
                            <div className="space-y-8 animate-in fade-in duration-700">
                                <LoadingOrchestrator activeStep="analysis" />
                            </div>
                        )}

                        {showRoadmap && !isLoading && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="flex justify-between items-end px-4">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                        Votre Roadmap
                                    </h2>
                                    <ExportButton
                                        markdown="# Roadmap\n\n- Phase 1: MVP"
                                        data={{ title: 'Roadmap', phases: ['MVP'] }}
                                    />
                                </div>

                                <ErrorBoundary>
                                    {shouldCrash ? (
                                        <CrashingComponent />
                                    ) : (
                                        <RoadmapCanvas roadmap={mockRoadmap} onTaskStatusChange={(id, status) => showToast(`Task ${id} to ${status}`, 'success')} />
                                    )}
                                </ErrorBoundary>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <ActionItemsList
                                        tasks={tasks}
                                        onStatusChange={handleStatusChange}
                                    />
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-tight italic">
                                            <Sparkles size={24} className="text-blue-500" />
                                            Affiner la vision
                                        </h3>
                                        <ReviseInput 
                                            onRevise={(ins) => {
                                                showToast('Demande de révision envoyée', 'success');
                                                console.log('Revision requested:', ins);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                ) : (
                    <section className="space-y-12">
                        <header className="space-y-2 px-2 text-left">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                Documentation
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                                Guide visuel et interactif des composants UI EchoMaps.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                            {/* Left Column */}
                            <div className="space-y-12 text-left">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Atomic Primitives
                                    </h3>
                                    <div className="p-8 bg-white/10 dark:bg-black/20 rounded-[2.5rem] border border-white/20 space-y-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Buttons</p>
                                            <div className="flex flex-wrap gap-3">
                                                <Button variant="primary">Primary</Button>
                                                <Button variant="secondary">Secondary</Button>
                                                <Button variant="danger">Danger</Button>
                                                <Button variant="primary" isLoading>Loading</Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Badges</p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="priority" type="high">High</Badge>
                                                <Badge variant="status" type="doing">In Progress</Badge>
                                                <Badge variant="estimate">Size: M</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Input</p>
                                            <Input label="Nom du Projet" placeholder="Ex: Mon Super Hackathon" />
                                            <Input label="Email" placeholder="user@example.com" error="Email invalide" defaultValue="invalid-email" />
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Spinners</p>
                                            <div className="flex items-center gap-6">
                                                <Spinner size="sm" />
                                                <Spinner size="md" className="text-blue-500" />
                                                <Spinner size="lg" className="text-[#ff4f00]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Brain Dump Fallback
                                    </h3>
                                    <div className="p-8 bg-white/10 dark:bg-black/20 rounded-[2.5rem] border border-white/20 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Composant Interactif</p>
                                            <button 
                                                onClick={() => setSimulateSTTError(!simulateSTTError)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-2",
                                                    simulateSTTError ? "bg-amber-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                                                )}
                                            >
                                                <AlertOctagon size={12} />
                                                {simulateSTTError ? "Mode Fallback Actif" : "Simuler Timeout Micro"}
                                            </button>
                                        </div>
                                        
                                        <div className="relative">
                                            {/* Note: In a real app, the BrainDumpInput would receive an external error signal or handle it internally. 
                                                Here we show how it looks when the internal fallback is triggered. */}
                                            <BrainDumpInput onGenerate={() => {}} />
                                            {simulateSTTError && (
                                                <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 rounded-3xl" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic">
                                            * En conditions réelles, le mode manuel s&apos;active si le micro met plus de 5s à répondre.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Task States (Interactive)
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Simulateur de blocage</p>
                                            <button 
                                                onClick={() => setIsDemoBlocked(!isDemoBlocked)}
                                                className={cn(
                                                    "w-10 h-5 rounded-full transition-colors relative",
                                                    isDemoBlocked ? "bg-red-500" : "bg-slate-300 dark:bg-slate-700"
                                                )}
                                            >
                                                <motion.div 
                                                    animate={{ x: isDemoBlocked ? 20 : 2 }}
                                                    className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                                />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-4">
                                            <TaskCard 
                                                task={{ id: 'demo-1', title: "Tâche interactive (Utilisez le switch)", priority: 'high', status: 'backlog', estimate: 'M' }}
                                                isBlocked={isDemoBlocked}
                                                blockedBy={["Configuration du serveur", "Validation Sécurité"]}
                                                onStatusChange={() => showToast("Statut mis à jour", "success")}
                                            />
                                            <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-2" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase px-2">Galerie de statuts</p>
                                            <TaskCard 
                                                task={{ id: 's1', title: "Tâche en attente (Backlog)", priority: 'low', status: 'backlog', estimate: 'S' }}
                                                onStatusChange={() => {}}
                                            />
                                            <TaskCard 
                                                task={{ id: 's3', title: "Tâche terminée (Done)", priority: 'high', status: 'done', estimate: 'L' }}
                                                onStatusChange={() => {}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-12 text-left">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Objective Molecule
                                    </h3>
                                    <ObjectiveCard 
                                        title="Lancer le MVP"
                                        priority="high"
                                        tasks={[
                                            { id: 't1', title: "Setup Database", status: 'done', priority: 'high', estimate: 'M' },
                                            { id: 't2', title: "Auth Integration", status: 'doing', priority: 'high', estimate: 'L' },
                                            { id: 't3', title: "Landing Page", status: 'backlog', priority: 'medium', estimate: 'S' },
                                            { id: 't4', title: "Deploy to Prod", status: 'backlog', priority: 'high', estimate: 'M' },
                                        ]}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        AI Clarification
                                    </h3>
                                    <div className="p-8 bg-white/10 dark:bg-black/20 rounded-[2.5rem] border border-white/20 flex flex-col items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                            <Brain size={24} />
                                        </div>
                                        <p className="text-sm text-slate-500 text-center font-medium">Tester l&apos;apparition de la bulle de question IA :</p>
                                        <button 
                                            onClick={() => setIsBubbleVisible(true)}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tighter italic shadow-xl hover:scale-105 transition-all"
                                        >
                                            Déclencher Question
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Timeline Canvas
                                    </h3>
                                    <div className="p-6 bg-white/10 dark:bg-black/20 rounded-[2.5rem] border border-white/20 h-[500px] overflow-hidden">
                                        <RoadmapCanvas roadmap={mockRoadmap} className="h-full" />
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Roadmap Revision
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase px-2">Standard Revision Input</p>
                                            <ReviseInput 
                                                onRevise={(ins) => showToast(`Révision demandée : ${ins}`, "success")} 
                                                isProcessing={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Toasts & Retry Logic
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() =>
                                                showToast('Données sauvegardées.', 'success')
                                            }
                                            className="px-4 py-2 bg-green-500 text-white rounded-full font-bold text-xs transition-all active:scale-95 shadow-lg"
                                        >
                                            Test Success
                                        </button>
                                        <button
                                            onClick={() =>
                                                showToast('Échec ElevenLabs.', 'error', {
                                                    label: 'Réessayer',
                                                    onClick: () =>
                                                        showToast(
                                                            "Relance de l'audio...",
                                                            'success',
                                                        ),
                                                })
                                            }
                                            className="px-4 py-2 bg-red-500 text-white rounded-full font-bold text-xs transition-all active:scale-95 shadow-lg"
                                        >
                                            Test Error + Retry
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Action List (Grouped)
                                    </h3>
                                    <ActionItemsList
                                        tasks={tasks}
                                        onStatusChange={handleStatusChange}
                                    />
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Error Boundary State
                                    </h3>
                                    <div className="p-8 bg-white/10 rounded-[2.5rem] border border-white/20 flex flex-col items-center gap-4 shadow-xl">
                                        <button
                                            onClick={() => setShouldCrash(true)}
                                            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-tighter italic shadow-xl hover:scale-105 transition-all"
                                        >
                                            <Bug size={18} /> Simuler Crash
                                        </button>
                                        {shouldCrash && (
                                            <div className="w-full mt-4 text-left">
                                                <ErrorBoundary
                                                    fallback={
                                                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold border border-red-100">
                                                            Crash intercepté !
                                                        </div>
                                                    }
                                                >
                                                    <CrashingComponent />
                                                </ErrorBoundary>
                                                <button
                                                    onClick={() => setShouldCrash(false)}
                                                    className="mt-4 text-xs text-blue-500 underline w-full text-center"
                                                >
                                                    Reset Test
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Loading & Orchestration
                                    </h3>
                                    <LoadingOrchestrator
                                        onCancel={() => showToast("Opération annulée", "error")}
                                        className="max-w-none"
                                    />
                                </div>

                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Export Actions
                                    </h3>
                                    <div className="flex items-center gap-4 bg-white/10 p-6 rounded-[2rem] border border-white/20 shadow-xl">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Exporter les données</p>
                                            <p className="text-[10px] text-slate-400">Markdown, JSON ou PDF</p>
                                        </div>
                                        <ExportButton markdown="# Test" data={{}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
