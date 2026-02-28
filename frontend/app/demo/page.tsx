'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Play, Moon, Sun, BookOpen, Home } from 'lucide-react';
import { MicButton, MicButtonState } from '@/components/ui/MicButton';
import { TranscriptionLiveView } from '@/components/ui/TranscriptionLiveView';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { RoadmapCanvas, RoadmapItem } from '@/components/roadmap/RoadmapCanvas';
import { RoadmapRevisionInput } from '@/components/roadmap/RoadmapRevisionInput';
import { ActionItemsList, ActionItem } from '@/components/ui/ActionItemsList';
import { ExportButton } from '@/components/ui/ExportButton';
import { BrainDumpInput } from '@/components/BrainDumpInput';
import { cn } from '@/lib/utils';

export default function DemoPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'flow' | 'catalog'>('flow');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [micState, setMicState] = useState<MicButtonState>('idle');

  const mockActionItems: ActionItem[] = [
    { id: '1', title: "Définir l'architecture backend", priority: 'high', completed: false },
    { id: '2', title: 'Choisir la stack frontend', priority: 'medium', completed: true },
    { id: '3', title: 'Mise en place du CI/CD', priority: 'low', completed: false },
  ];

  const handleGenerate = (text: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRoadmap(true);
    }, 4000);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDarkMode ? "dark bg-slate-950" : "bg-slate-50"
    )}>
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
              Full Flow
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
              Component Library
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
              <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Roadmap <span className="text-blue-600">Architect</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
                Transformez vos réflexions en plans d&apos;action structurés grâce à l&apos;IA.
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
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Votre Roadmap</h2>
                  <ExportButton
                    markdown="# Roadmap\n\n- Phase 1: MVP"
                    data={{ title: "Roadmap", phases: ["MVP"] }}
                  />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ActionItemsList items={mockActionItems} />
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles size={24} className="text-blue-500" />
                      Affiner la vision
                    </h3>
                    <RoadmapRevisionInput onUpdate={(rev) => console.log("Revision requested:", rev)} />
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">MicButton & LiveView</h3>
                <div className="bg-white/10 dark:bg-black/20 p-8 rounded-3xl border border-white/20 dark:border-white/5 space-y-6 flex flex-col items-center">
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
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Action List</h3>
                <ActionItemsList items={mockActionItems} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Export Button</h3>
                <div className="bg-white/10 dark:bg-black/20 p-8 rounded-3xl border border-white/20 dark:border-white/5 flex justify-center">
                  <ExportButton markdown="# Test" data={{}} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revision Input</h3>
                <div className="bg-white/10 dark:bg-black/20 p-8 rounded-3xl border border-white/20 dark:border-white/5">
                  <RoadmapRevisionInput onUpdate={() => { }} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Orchestrator</h3>
                <LoadingOrchestrator activeStep="analysis" className="max-w-none" />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
