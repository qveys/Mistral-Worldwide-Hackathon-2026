'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const REVISION_CHIP_KEYS = ['chip1', 'chip2', 'chip3', 'chip4'] as const;

interface ReviseInputProps {
  onRevise: (instruction: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export function ReviseInput({ onRevise, isProcessing = false, className }: ReviseInputProps) {
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations('revise');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onRevise(inputValue);
      setInputValue("");
    }
  };

  const handleChipClick = (chip: string) => {
    if (isProcessing) return;
    setInputValue(chip);
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Label & Header */}
      <div className="flex items-center gap-2 px-2">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {t('intelligentAdjustment')}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 px-1">
        {REVISION_CHIP_KEYS.map((key) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChipClick(t(key))}
            disabled={isProcessing}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm",
              "bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-300",
              "hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:bg-blue-500/10",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <Sparkles size={12} className="text-blue-500" />
            {t(key)}
          </motion.button>
        ))}
      </div>

      {/* Main Input Form */}
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative group transition-all duration-500",
          isProcessing ? "opacity-60 scale-[0.99]" : "opacity-100 scale-100"
        )}
      >
        <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-[2rem] -z-10 group-focus-within:bg-blue-500/10 transition-colors" />
        
        <div className="relative flex items-center bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-2xl p-2 focus-within:border-blue-500/50 transition-all">
          <div className="pl-4 pr-2 text-blue-500">
            <Wand2 size={20} className={cn(isProcessing && "animate-pulse")} />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            placeholder={t('placeholder')}
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white py-4 px-2 text-lg font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className={cn(
              "flex items-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-tighter italic transition-all",
              inputValue.trim() && !isProcessing
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl hover:scale-105 active:scale-95"
                : "bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed"
            )}
          >
            <span>{t('button')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Helper Text */}
      <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest opacity-60">
        {t('helperText')}
      </p>
    </div>
  );
}
