'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

// Components
import { ClarificationBubble } from '@/components/brain-dump/ClarificationBubble';
import { MicButtonState } from '@/components/ui/MicButton';
import { Toast, ToastType } from '@/components/ui/Toast';

// Documentation Sub-components
import { Sidebar } from '@/components/documentation/Sidebar';
import { FoundationSection } from '@/components/documentation/FoundationSection';
import { CaptureSection } from '@/components/documentation/CaptureSection';
import { StrategySection } from '@/components/documentation/StrategySection';
import { SystemSection } from '@/components/documentation/SystemSection';
import { LivePreviewSection } from '@/components/documentation/LivePreviewSection';
import { MethodologySection } from '@/components/documentation/MethodologySection';
import { ApiSection } from '@/components/documentation/ApiSection';
import { DocCategory, MOCK_ROADMAP } from '@/components/documentation/constants';

function DocumentationContent() {
  const searchParams = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DocCategory>('foundation');
  const [roadmapViewMode, setRoadmapViewMode] = useState<'timeline' | 'graph'>('timeline');
  const [micState, setMicState] = useState<MicButtonState>('idle');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [simulateSTTError, setSimulateSTTError] = useState(false);
  const [shouldCrash, setShouldCrash] = useState(false);

  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({ 
    isVisible: false, message: '', type: 'success' 
  });

  const showToast = (message: string, type: ToastType) => setToast({ isVisible: true, message, type });

  useEffect(() => {
    const category = searchParams.get('category') as DocCategory;
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const tasks = useMemo(() => MOCK_ROADMAP.timeSlots.flatMap(slot => slot.tasks), []);

  return (
    <div className={cn('min-h-screen flex transition-colors duration-500', isDarkMode ? 'dark bg-[#0a0a0a]' : 'bg-[#fafafa]')}>
      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(p => ({ ...p, isVisible: false }))} 
      />
      
      <ClarificationBubble 
        isVisible={isBubbleVisible} 
        question="Est-ce un projet solo ou en équipe ?" 
        onReply={() => { showToast("Réponse enregistrée", "success"); setIsBubbleVisible(false); }} 
        onIgnore={() => setIsBubbleVisible(false)} 
      />

      <Sidebar 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />

      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeCategory === 'foundation' && <FoundationSection />}

            {activeCategory === 'capture' && (
              <CaptureSection 
                micState={micState}
                setMicState={setMicState}
                simulateSTTError={simulateSTTError}
                setSimulateSTTError={setSimulateSTTError}
                setIsBubbleVisible={setIsBubbleVisible}
                showToast={showToast}
              />
            )}

            {activeCategory === 'strategy' && (
              <StrategySection 
                roadmapViewMode={roadmapViewMode}
                setRoadmapViewMode={setRoadmapViewMode}
                tasks={tasks}
              />
            )}

            {activeCategory === 'system' && (
              <SystemSection 
                shouldCrash={shouldCrash}
                setShouldCrash={setShouldCrash}
                showToast={showToast}
              />
            )}

            {activeCategory === 'live-preview' && <LivePreviewSection />}
            {activeCategory === 'methodology' && <MethodologySection />}
            {activeCategory === 'api' && <ApiSection />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-black uppercase italic tracking-tighter text-4xl">Chargement...</div>}>
      <DocumentationContent />
    </Suspense>
  );
}
