'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TranscriptionLiveViewProps {
  text: string;
  isRecording: boolean;
  onTextChange: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function TranscriptionLiveView({
  text,
  isRecording,
  onTextChange,
  placeholder = "Votre brain dump apparaîtra ici...",
  className
}: TranscriptionLiveViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const words = text.split(' ').filter(w => w.length > 0);

  // Auto-scroll logic for the live view if needed
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isRecording && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [text, isRecording]);

  return (
    <div className={cn(
      "w-full min-h-[200px] transition-all duration-500",
      className
    )}>
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="live-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={scrollRef}
            className="w-full min-h-[200px] p-6 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl overflow-y-auto flex flex-wrap gap-x-1 gap-y-2 content-start"
          >
            {words.length === 0 && (
              <p className="text-slate-400 dark:text-slate-500 italic animate-pulse">
                Écoute en cours...
              </p>
            )}
            
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100"
              >
                {word}
              </motion.span>
            ))}

            {/* Blinking Cursor */}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-1.5 h-6 bg-blue-500 rounded-full self-center ml-1"
            />
          </motion.div>
        ) : (
          <motion.div
            key="editable-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[200px] p-6 rounded-3xl bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-inner focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none text-lg md:text-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
