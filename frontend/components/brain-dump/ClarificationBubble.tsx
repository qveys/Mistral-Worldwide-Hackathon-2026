'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Send, X } from 'lucide-react';

interface ClarificationBubbleProps {
    isVisible: boolean;
    question: string;
    onReply: (answer: string) => void;
    onIgnore: () => void;
    className?: string;
}

export function ClarificationBubble({
    isVisible,
    question,
    onReply,
    onIgnore,
    className,
}: ClarificationBubbleProps) {
    const [answer, setAnswer] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-close after 30s of inactivity
    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onIgnore();
        }, 30000);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                onIgnore();
            }
        };

        if (isVisible) {
            resetTimer();
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isVisible, onIgnore]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (answer.trim()) {
            onReply(answer);
            setAnswer('');
        }
    };

    return (
        <div
            className={cn(
                'fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl px-4',
                className,
            )}
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.9 }}
                        className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl"
                    >
                        <div className="flex items-start gap-4">
                            {/* AI Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10 animate-pulse">
                                    <Brain className="text-white" size={24} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                        Précision requise
                                    </span>
                                    <p className="text-white text-lg font-medium leading-snug">
                                        {question}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="relative group">
                                    <input
                                        type="text"
                                        value={answer}
                                        onChange={(e) => {
                                            setAnswer(e.target.value);
                                            resetTimer();
                                        }}
                                        placeholder="Répondez ici pour affiner..."
                                        aria-label="Votre réponse à la question de clarification"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!answer.trim()}
                                        aria-label="Envoyer la réponse"
                                        className={cn(
                                            'absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all',
                                            answer.trim()
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-slate-600 cursor-not-allowed',
                                        )}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>

                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        L&apos;IA attend votre retour...
                                    </p>
                                    <button
                                        onClick={onIgnore}
                                        aria-label="Ignorer la question de clarification"
                                        className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1 group"
                                    >
                                        Ignorer
                                        <X
                                            size={14}
                                            className="group-hover:rotate-90 transition-transform"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
