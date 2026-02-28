'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, Sparkles, Brain, FileText, CheckCircle2 } from 'lucide-react';

const LOADING_MESSAGES = [
  "Analyse du flux audio...",
  "Extraction des concepts clés...",
  "Structure de la roadmap en cours...",
  "Calcul des dépendances...",
  "Génération des tâches prioritaires...",
  "Finalisation de la vision stratégique..."
];

const STEPS = [
  { id: 'transcription', label: 'Transcription Audio', icon: FileText },
  { id: 'analysis', label: 'Analyse IA', icon: Brain },
  { id: 'roadmap', label: 'Génération Roadmap', icon: Sparkles },
];

interface LoadingOrchestratorProps {
  activeStep: 'transcription' | 'analysis' | 'roadmap';
  className?: string;
}

export function LoadingOrchestrator({ activeStep, className }: LoadingOrchestratorProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("w-full max-w-2xl mx-auto p-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10", className)}>
      <div className="flex flex-col items-center gap-8">
        
        {/* Animated Icon */}
        <div className="relative h-24 w-24 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-dashed border-blue-100 dark:border-blue-900/30 rounded-full"
          />
          <div className="bg-blue-600 h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <Loader2 className="animate-spin text-white h-8 w-8" />
          </div>
        </div>

        {/* Dynamic Text */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={LOADING_MESSAGES[messageIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-semibold text-slate-700 dark:text-slate-200 text-center"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Steps Progress */}
        <div className="w-full flex justify-between gap-4 mt-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isPast = STEPS.findIndex(s => s.id === activeStep) > index;
            
            return (
              <div key={step.id} className="flex-1 flex flex-col items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-500",
                  isActive && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black",
                  isPast && "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                  !isActive && !isPast && "bg-slate-50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600"
                )}>
                  {isPast ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isActive && "text-blue-600 dark:text-blue-400",
                  isPast && "text-green-600 dark:text-green-400",
                  !isActive && !isPast && "text-slate-400 dark:text-slate-600"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skeleton Preview */}
        <div className="w-full space-y-3 mt-6">
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 mx-auto"
          />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2 mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
