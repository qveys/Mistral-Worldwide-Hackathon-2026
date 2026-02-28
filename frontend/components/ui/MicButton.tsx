'use client';

import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MicButtonState = 'idle' | 'recording' | 'processing';

interface MicButtonProps {
  state: MicButtonState;
  onClick: () => void;
  className?: string;
}

export function MicButton({ state, onClick, className }: MicButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={state === 'processing'}
      className={cn(
        "relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        state === 'idle' && "bg-blue-600 hover:bg-blue-700 text-white",
        state === 'recording' && "bg-red-500 hover:bg-red-600 text-white",
        state === 'processing' && "bg-gray-200 text-gray-500 cursor-not-allowed",
        className
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
            className="relative flex items-center justify-center"
          >
            <Square size={32} fill="currentColor" />
            
            {/* Audio Wave Circles */}
            <div className="absolute inset-0 -m-8 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute h-full w-full rounded-full border-2 border-red-500"
              />
              <motion.div
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                className="absolute h-full w-full rounded-full border-2 border-red-400"
              />
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
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
