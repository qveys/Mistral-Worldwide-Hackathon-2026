import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { LoadingOrchestrator } from '@/components/ui/LoadingOrchestrator';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ExportButton } from '@/components/ui/ExportButton';
import { cn } from '@/lib/utils';
import { ToastType } from '@/components/ui/Toast';

interface SystemSectionProps {
  shouldCrash: boolean;
  setShouldCrash: (value: boolean) => void;
  showToast: (message: string, type: ToastType) => void;
}

export const SystemSection = ({
  shouldCrash,
  setShouldCrash,
  showToast
}: SystemSectionProps) => (
  <motion.div key="system" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    <SectionHeader title="Infrastructure & Feedback" description="Gestion des états système et de la résilience." />
    
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-[2.5rem] p-8 shadow-lg dark:shadow-xl">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6 block">Latency Orchestrator</span>
        <LoadingOrchestrator className="max-w-none" onCancel={() => showToast("Annulé", "error")} />
      </div>
      <div className="md:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-[2.5rem] p-6 space-y-4 shadow-lg dark:shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase italic text-red-500">Resilience</span>
            <button 
              onClick={() => setShouldCrash(!shouldCrash)} 
              className={cn("px-2 py-1 rounded-lg text-[8px] font-black uppercase border transition-all", shouldCrash ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "border-red-500/20 text-red-500 hover:bg-red-500/10")}
            >
              {shouldCrash ? "Reset" : "Crash UI"}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {shouldCrash ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ErrorBoundary fallback={<div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[9px] font-bold text-center border border-red-100 dark:border-red-900/30">Erreur Interceptée</div>}>
                  <div className="hidden">{(() => { if (shouldCrash) throw new Error("!"); return null; })()}</div>
                </ErrorBoundary>
              </motion.div>
            ) : (
              <div className="py-4 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 opacity-30">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Stable</span>
              </div>
            )}
          </AnimatePresence>
        </div>
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-[2.5rem] p-6 flex flex-col gap-4 shadow-lg dark:shadow-xl">
          <span className="text-[10px] font-black uppercase italic text-slate-400">Feedback & Data</span>
          <div className="flex gap-2">
            <button onClick={() => showToast('Succès', 'success')} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Toast</button>
            <button onClick={() => showToast('Erreur critique', 'error')} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Error</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-xl border-2 border-slate-200 dark:border-slate-600">
            <span className="text-[9px] font-black uppercase dark:text-white leading-tight">Export Package</span>
            <ExportButton markdown="# Mock" data={{}} />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
