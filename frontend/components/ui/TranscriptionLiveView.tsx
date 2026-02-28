'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TranscriptionLiveViewProps {
  text: string;
  className?: string;
  isStreaming?: boolean;
}

export function TranscriptionLiveView({ text, className, isStreaming = false }: TranscriptionLiveViewProps) {
  const words = text.split(' ');

  return (
    <div className={cn(
      "min-h-[100px] p-6 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl flex flex-wrap gap-x-1 gap-y-2 content-start",
      className
    )}>
      <AnimatePresence mode="popLayout">
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: isStreaming ? 0 : index * 0.05
            }}
            className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100"
          >
            {word}
          </motion.span>
        ))}
      </AnimatePresence>

      {isStreaming && (
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1.5 h-6 bg-blue-500 rounded-full ml-1 self-center"
        />
      )}

      {text.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 italic">La transcription s&apos;affichera ici en temps réel...</p>
      )}
    </div>
  );
}
