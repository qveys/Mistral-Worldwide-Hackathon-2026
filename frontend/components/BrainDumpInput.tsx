'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MicButton, MicButtonState } from './ui/MicButton';
import { TranscriptionLiveView } from './ui/TranscriptionLiveView';

interface BrainDumpInputProps {
  onGenerate: (text: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export function BrainDumpInput({ onGenerate, isProcessing = false, className }: BrainDumpInputProps) {
  const [text, setText] = useState("");
  const [micState, setMicState] = useState<MicButtonState>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (micState === 'recording') {
      setIsEditing(false);
    }
    return () => clearInterval(interval);
  }, [micState]);

  const handleMicClick = () => {
    if (micState === 'idle') {
      setMicState('recording');
    } else if (micState === 'recording') {
      setMicState('idle');
      setIsEditing(true);
    }
  };

  const handleGenerate = () => {
    if (text.trim() && !isProcessing) {
      onGenerate(text);
    }
  };

  const clearText = () => {
    setText("");
    setIsEditing(false);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div
            key="input-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/20 dark:border-white/10 relative"
          >
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Brain Dump Engine</span>
              </div>
              {text && (
                <button 
                  onClick={clearText}
                  className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                >
                  <Eraser size={12} />
                  Effacer
                </button>
              )}
            </div>

            {/* Main Input Zone */}
            <div className="relative min-h-[140px] mb-4">
              {micState === 'recording' ? (
                <TranscriptionLiveView text={text} isStreaming={true} className="bg-transparent shadow-none border-none p-0 min-h-[140px]" />
              ) : (
                <div className="relative group">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsEditing(true)}
                    placeholder=""
                    className="w-full min-h-[140px] bg-transparent border-none focus:ring-0 text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none py-1"
                  />
                  
                  <AnimatePresence>
                    {!text && !isEditing && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center space-y-3"
                      >
                        <motion.p 
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-xl font-medium text-slate-400 dark:text-slate-600"
                        >
                          Parlez ou écrivez ici...
                        </motion.p>
                        <Sparkles className="text-blue-300 dark:text-blue-900/50 animate-bounce" size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between border-t border-white/20 dark:border-white/5 pt-4">
              <div className="flex items-center gap-4">
                <MicButton state={micState} onClick={handleMicClick} className="h-14 w-14" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{wordCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">Mots</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!text.trim() || micState === 'recording'}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-lg",
                  text.trim() && micState !== 'recording'
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/20 scale-100 hover:scale-105"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700 cursor-not-allowed scale-95"
                )}
              >
                <Send size={18} />
                Générer Roadmap
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="h-1.5 w-48 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-full bg-blue-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
