'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapRevisionInputProps {
  onUpdate: (revision: string) => void;
  className?: string;
  isProcessing?: boolean;
}

const REFINE_CHIP_KEYS = ['chip1', 'chip2', 'chip3', 'chip4', 'chip5'] as const;

export function RoadmapRevisionInput({ onUpdate, className, isProcessing = false }: RoadmapRevisionInputProps) {
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations('roadmapRevision');
  const tRevise = useTranslations('revise');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onUpdate(inputValue);
      setInputValue("");
    }
  };

  const handleChipClick = (chip: string) => {
    if (!isProcessing) {
      onUpdate(chip);
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {REFINE_CHIP_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleChipClick(t(key))}
            disabled={isProcessing}
            className="px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/40 rounded-full text-sm font-medium text-slate-700 hover:bg-white/60 hover:border-blue-300 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group shadow-sm"
          >
            <Sparkles size={14} className="text-blue-400 group-hover:text-blue-600" />
            {t(key)}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all p-1.5"
      >
        <div className="pl-3 pr-2 text-slate-400">
          <RefreshCcw size={20} className={cn(isProcessing && "animate-spin text-blue-500")} />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={tRevise('refinePlaceholder')}
          disabled={isProcessing}
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 py-3 text-lg placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isProcessing}
          className={cn(
            "p-3 rounded-xl transition-all flex items-center justify-center",
            inputValue.trim() && !isProcessing 
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
