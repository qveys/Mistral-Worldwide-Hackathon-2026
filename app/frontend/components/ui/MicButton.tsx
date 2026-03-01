'use client';

import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MicButtonState = 'idle' | 'recording' | 'processing';

interface MicButtonProps {
  state: MicButtonState;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function MicButton({ state, onClick, disabled = false, className }: MicButtonProps) {
  const getAriaLabel = () => {
    switch (state) {
      case 'idle': return "Démarrer l'enregistrement";
      case 'recording': return "Arrêter l'enregistrement";
      case 'processing': return "Traitement audio en cours";
      default: return "Microphone";
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Background Pulse Animation for Recording State */}
      <AnimatePresence>
        {state === 'recording' && (
          <>
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-red-500/30 -z-10"
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-red-400/20 -z-10"
            />
          </>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        disabled={disabled || state === 'processing'}
        aria-label={getAriaLabel()}
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2",
          state === 'idle' && "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-400",
          state === 'recording' && "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 animate-pulse",
          state === 'processing' && "bg-slate-200 dark:bg-slate-900 text-slate-400 cursor-not-allowed focus:ring-slate-300",
          disabled && "opacity-50 grayscale cursor-not-allowed"
        )}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Mic size={32} />
            </motion.div>
          )}
          {state === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              {/* Animated Audio Bars */}
              <div className="flex items-center gap-0.5 h-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 12, 32, 8] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
              <Square size={24} fill="currentColor" />
              <div className="flex items-center gap-0.5 h-8 rotate-180">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 12, 32, 8] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 size={32} className="animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
