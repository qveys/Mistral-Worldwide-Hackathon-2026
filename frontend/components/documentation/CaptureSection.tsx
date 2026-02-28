import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { MicButton, MicButtonState } from '@/components/ui/MicButton';
import { TranscriptionLiveView } from '@/components/brain-dump/TranscriptionLiveView';
import { BrainDumpInput } from '@/components/brain-dump/BrainDumpInput';
import { cn } from '@/lib/utils';

interface CaptureSectionProps {
  micState: MicButtonState;
  setMicState: (state: MicButtonState) => void;
  simulateSTTError: boolean;
  setSimulateSTTError: (value: boolean) => void;
  setIsBubbleVisible: (value: boolean) => void;
  showToast: (message: string, type: any) => void;
}

export const CaptureSection = ({
  micState,
  setMicState,
  simulateSTTError,
  setSimulateSTTError,
  setIsBubbleVisible,
  showToast
}: CaptureSectionProps) => (
  <motion.div key="capture" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    <SectionHeader title="Brain Dump" description="Capture de la pensée par la voix et le texte." />
    
    <div className="space-y-8">
      {/* Compact Voice Showcase */}
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 flex items-center gap-10 shadow-lg">
        <div className="flex-shrink-0 flex flex-col items-center gap-3 pr-10 border-r border-slate-100 dark:border-white/5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff4f00] italic">Live Mic</span>
          <MicButton state={micState} onClick={() => setMicState(micState === 'idle' ? 'recording' : 'idle')} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black uppercase italic dark:text-white mb-2">Transcription Live</h3>
          <TranscriptionLiveView 
            text="L'IA capture vos paroles pour structurer la roadmap..." 
            isRecording={micState === 'recording'} 
            onTextChange={() => {}}
            className="bg-transparent p-0 border-none shadow-none min-h-0" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">Brain Dump Engine</span>
            <button 
              onClick={() => setSimulateSTTError(!simulateSTTError)} 
              className={cn("px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all", simulateSTTError ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500")}
            >
              Simuler Timeout
            </button>
          </div>
          <BrainDumpInput onGenerate={(t) => showToast(`Génération: ${t.slice(0, 15)}...`, "success")} />
        </div>
        <div className="flex flex-col items-center justify-center p-8 bg-blue-600/5 rounded-[2.5rem] border border-blue-500/10 text-center gap-4">
          <button 
            onClick={() => setIsBubbleVisible(true)} 
            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase italic shadow-xl hover:scale-105 transition-all"
          >
            Bulle Clarification
          </button>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-tight">Interaction contextuelle en cas d&apos;ambiguïté.</p>
        </div>
      </div>
    </div>
  </motion.div>
);
