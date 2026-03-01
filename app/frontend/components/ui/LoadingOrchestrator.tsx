'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Clock, Sparkles, Target, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const LOADING_STEPS = [
    { id: 'analyzing' as const, icon: Brain, duration: 8000 },
    { id: 'objectives' as const, icon: Target, duration: 10000 },
    { id: 'prioritizing' as const, icon: Clock, duration: 7000 },
    { id: 'timeline' as const, icon: Sparkles, duration: 5000 },
];

interface LoadingOrchestratorProps {
    onCancel?: () => void;
    className?: string;
}

export function LoadingOrchestrator({ onCancel, className }: LoadingOrchestratorProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showCancel, setShowCancel] = useState(false);
    const startTimeRef = useRef(0);
    const t = useTranslations('loading');

    useEffect(() => {
        startTimeRef.current = Date.now();
        // Fake Progress Bar (Linear-ish)
        const totalDuration = LOADING_STEPS.reduce((acc, step) => acc + step.duration, 0);
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 98); // Stuck at 98% until done
            setProgress(newProgress);

            // Cancel button logic (after 45s)
            if (elapsed > 45000) {
                setShowCancel(true);
            }
        }, 100);

        // Step Transition logic
        let stepTimer: NodeJS.Timeout;
        const runStep = (index: number) => {
            if (index >= LOADING_STEPS.length) return;

            stepTimer = setTimeout(() => {
                setCurrentStepIndex(index + 1);
                runStep(index + 1);
            }, LOADING_STEPS[index].duration);
        };

        runStep(0);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(stepTimer);
        };
    }, []);

    const currentStep = LOADING_STEPS[Math.min(currentStepIndex, LOADING_STEPS.length - 1)];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className={cn(
                'w-full max-w-2xl mx-auto p-12 bg-white/40 dark:bg-black/60 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-white/5 relative overflow-hidden',
                className,
            )}
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/10 blur-[100px] pointer-events-none" />

            <div className="flex flex-col items-center gap-10 relative z-10">
                {/* Central Pulse Icon */}
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
                    />
                    <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 ring-4 ring-blue-500/20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep.id}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                {React.createElement(currentStep.icon, {
                                    className: 'text-white h-10 w-10',
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Message Orchestration */}
                <div className="text-center space-y-2 h-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-1"
                        >
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                {t(currentStep.id)}
                            </h3>
                            <p className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em]">
                                {t('phase')} {Math.min(currentStepIndex + 1, 4)} / 4
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Fake Progress Bar */}
                <div className="w-full space-y-4">
                    <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: 'linear' }}
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {t('progression')}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="w-full grid grid-cols-4 gap-2">
                    {LOADING_STEPS.map((step, i) => (
                        <div
                            key={step.id}
                            className={cn(
                                'h-1 rounded-full transition-all duration-500',
                                currentStepIndex >= i
                                    ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                    : 'bg-slate-200 dark:bg-white/5',
                            )}
                        />
                    ))}
                </div>

                {/* Cancel Button (Dynamic) */}
                <AnimatePresence>
                    {showCancel && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={onCancel}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all font-black uppercase tracking-tighter italic text-xs mt-4"
                        >
                            <XCircle size={16} />
                            {t('cancelHint')}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </motion.div>
    );
}
