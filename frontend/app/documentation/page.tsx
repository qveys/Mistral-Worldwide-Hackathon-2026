'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Play, Moon, Sun, BookOpen, Home, AlertCircle, CheckCircle2, AlertTriangle, Bug } from 'lucide-react';
import { MicButton, MicButtonState } from '@/components/ui/MicButton';
import { TranscriptionLiveView } from '@/components/ui/TranscriptionLiveView';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { RoadmapCanvas, RoadmapItem } from '@/components/roadmap/RoadmapCanvas';
import { RoadmapRevisionInput } from '@/components/roadmap/RoadmapRevisionInput';
import { ExportButton } from '@/components/ui/ExportButton';
import { BrainDumpInput } from '@/components/BrainDumpInput';
import { ActionItemsList } from '@/components/ActionItemsList';
import { Task, TaskStatus } from '@/components/TaskCard';
import { Toast, ToastType } from '@/components/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

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
  const lastPromptRef = useRef<string>("");

  // Toast State
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType; action?: { label: string; onClick: () => void } }>({
    isVisible: false,
    message: "",
    type: 'success'
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: "Définir l'architecture backend", priority: 'high', status: 'doing', estimate: 'M' },
    { id: '2', title: 'Choisir la stack frontend', priority: 'medium', status: 'done', estimate: 'S' },
    { id: '3', title: 'Mise en place du CI/CD', priority: 'low', status: 'backlog', estimate: 'L' },
    { id: '4', title: 'Configuration de la base de données', priority: 'high', status: 'backlog', estimate: 'M' },
  ]);

  const showToast = (message: string, type: ToastType, action?: { label: string; onClick: () => void }) => {
    setToast({ isVisible: true, message, type, action });
  };

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    showToast(`Tâche mise à jour : ${newStatus.toUpperCase()}`, 'success');
  };

  const handleGenerate = (text: string) => {
    lastPromptRef.current = text;
    setIsLoading(true);
    const hasError = Math.random() > 0.7;
    
    setTimeout(() => {
      setIsLoading(false);
      if (hasError) {
        showToast(
          "Erreur Bedrock : Échec de la génération.", 
          "error", 
          { label: "Réessayer", onClick: () => handleGenerate(lastPromptRef.current) }
        );
      } else {
        setShowRoadmap(true);
        showToast("Roadmap générée avec succès !", "success");
      }
    }, 2000);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
    )}>
      {/* Toast Notification */}
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        action={toast.action}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={cn(
          "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-opacity duration-1000",
          isDarkMode ? "bg-blue-900/20 opacity-40" : "bg-blue-200 opacity-60"
        )} />
        <div className={cn(
          "absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-opacity duration-1000",
          isDarkMode ? "bg-purple-900/20 opacity-40" : "bg-purple-200 opacity-60"
        )} />
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
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform",
                view === 'flow'
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100"
                  : "text-slate-500 hover:bg-white/20 dark:hover:bg-black/40 hover:scale-105"
              )}
            >
              <Play size={18} />
              Live Preview
            </button>
            <button
              onClick={() => setView('catalog')}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform",
                view === 'catalog'
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100"
                  : "text-slate-500 hover:bg-white/20 dark:hover:bg-black/40 hover:scale-105"
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
                Roadmap <span className="text-blue-600 uppercase not-italic">Architect</span>
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
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter italic">Votre Roadmap</h2>
                  <ExportButton
                    markdown="# Roadmap\n\n- Phase 1: MVP"
                    data={{ title: "Roadmap", phases: ["MVP"] }}
                  />
                </div>

                <ErrorBoundary>
                  {shouldCrash ? <CrashingComponent /> : (
                    <RoadmapCanvas title="Plan d'Exécution Stratégique">
                      <RoadmapItem
                        title="Phase 1: MVP"
                        description="Lancement de la version de base avec les fonctionnalités essentielles."
                        period="Mars - Avril"
                        status="done"
                      />
                      <RoadmapItem
                        title="Phase 2: Scale"
                        description="Optimisation des performances et montée en charge."
                        period="Mai - Juin"
                        status="in-progress"
                      />
                      <RoadmapItem
                        title="Phase 3: Global"
                        description="Déploiement international et nouvelles langues."
                        period="Juillet - Août"
                        status="todo"
                      />
                    </RoadmapCanvas>
                  )}
                </ErrorBoundary>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <ActionItemsList tasks={tasks} onStatusChange={handleStatusChange} />
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 uppercase tracking-tight italic">
                      <Sparkles size={24} className="text-blue-500" />
                      Affiner la vision
                    </h3>
                    <RoadmapRevisionInput onUpdate={(rev) => {
                      showToast("Demande de révision envoyée", "success");
                      console.log("Revision requested:", rev);
                    }} />
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-12">
            <header className="space-y-2 px-2">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Documentation</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Guide visuel et interactif des composants UI EchoMaps.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Voice & Transcription</h3>
                  <div className="bg-white/10 dark:bg-black/20 p-8 rounded-[2.5rem] border border-white/20 space-y-6 flex flex-col items-center">
                    <MicButton 
                      state={micState} 
                      onClick={() => setMicState(micState === 'idle' ? 'recording' : 'idle')} 
                    />
                    <TranscriptionLiveView 
                      text="Ceci est une prévisualisation de la transcription qui s'anime mot par mot." 
                      isStreaming={micState === 'recording'}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Toasts & Retry Logic</h3>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => showToast("Données sauvegardées.", "success")} className="px-4 py-2 bg-green-500 text-white rounded-full font-bold text-xs transition-all active:scale-95 shadow-lg">Test Success</button>
                    <button 
                      onClick={() => showToast("Échec ElevenLabs.", "error", { label: "Réessayer", onClick: () => showToast("Relance de l'audio...", "success") })} 
                      className="px-4 py-2 bg-red-500 text-white rounded-full font-bold text-xs transition-all active:scale-95 shadow-lg"
                    >
                      Test Error + Retry
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Action List</h3>
                  <ActionItemsList tasks={tasks} onStatusChange={handleStatusChange} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Layout & Canvas</h3>
                  <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/20">
                    <RoadmapItem 
                      title="Composant RoadmapItem" 
                      description="Un item individuel de la roadmap avec son statut et sa période." 
                      period="Q1 2026"
                      status="in-progress"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Error Boundary State</h3>
                  <div className="p-8 bg-white/10 rounded-[2.5rem] border border-white/20 flex flex-col items-center gap-4 shadow-xl">
                    <button onClick={() => setShouldCrash(true)} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-tighter italic shadow-xl hover:scale-105 transition-all">Simuler Crash</button>
                    {shouldCrash && (
                      <div className="w-full mt-4">
                        <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-bold border border-red-100">Crash intercepté !</div>}>
                          <CrashingComponent />
                        </ErrorBoundary>
                        <button onClick={() => setShouldCrash(false)} className="mt-4 text-xs text-blue-500 underline w-full text-center">Reset Test</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Loading & Orchestration</h3>
                  <LoadingOrchestrator activeStep="roadmap" className="max-w-none" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Export & Inputs</h3>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl border border-white/20">
                    <ExportButton markdown="# Test" data={{}} />
                    <div className="flex-1">
                      <RoadmapRevisionInput onUpdate={() => {}} />
                    </div>
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
