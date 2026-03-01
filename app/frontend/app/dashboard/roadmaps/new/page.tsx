'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainDumpInput } from '@/components/brain-dump/BrainDumpInput';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

export default function NewRoadmapPage() {
  const router = useRouter();
  const { isDarkMode } = useDashboardTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = (text: string, includePlanning: boolean) => {
    setIsProcessing(true);
    const id = crypto.randomUUID();
    const params = new URLSearchParams({ text });
    if (includePlanning) params.set('planning', '1');
    router.push(`/project/${id}?${params.toString()}`);
  };

  return (
    <div className={cn(
      "min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 lg:p-10",
      isDarkMode ? "bg-transparent" : "bg-transparent"
    )}>
      <div className="w-full max-w-2xl">
        <div className={cn(
          "p-8 lg:p-10 rounded-4xl",
          isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
        )}>
          <h1 className={cn(
            "text-2xl font-bold tracking-tight mb-2 text-center",
            isDarkMode ? "text-white" : "text-slate-900"
          )}>
            New Roadmap
          </h1>
          <p className={cn(
            "text-sm text-center mb-8",
            isDarkMode ? "text-zinc-500" : "text-slate-600"
          )}>
            Parlez ou écrivez votre idée. Mistral structurera votre roadmap.
          </p>
          <BrainDumpInput
            onGenerate={handleGenerate}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
