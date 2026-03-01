'use client';

import { useTranslations } from 'next-intl';
import { useVoxtralSTT } from '@/lib/useVoxtralSTT';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CalendarDays, Eraser, RefreshCcw, Send, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { MicButton, MicButtonState } from '../ui/MicButton';
import { TranscriptionLiveView } from './TranscriptionLiveView';

interface BrainDumpInputProps {
    onGenerate: (text: string, includePlanning: boolean) => void;
    isProcessing?: boolean;
    className?: string;
}

export function BrainDumpInput({
    onGenerate,
    isProcessing = false,
    className,
}: BrainDumpInputProps) {
    const [manualText, setManualText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [manualFallback, setManualFallback] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [includePlanning, setIncludePlanning] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const t = useTranslations('brainDump');

    const {
        transcript,
        isStreaming,
        error: sttError,
        startRecording,
        stopRecording,
        resetTranscript,
    } = useVoxtralSTT();

    // Derive fallback state: manual fallback OR STT error
    const isFallback = manualFallback || !!sttError;

    // Derive micState
    const micState: MicButtonState = isStreaming
        ? 'recording'
        : isConnecting && !isFallback
          ? 'processing'
          : 'idle';

    // Merge: prioritize live transcript, then manual text
    const text = transcript || manualText;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    const handleMicClick = async () => {
        if (micState === 'idle') {
            setIsConnecting(true);
            setManualFallback(false);
            resetTranscript();
            setManualText('');

            // Timeout logic: if no streaming after 5s, trigger fallback
            connectionTimeoutRef.current = setTimeout(() => {
                if (!isStreaming) {
                    setManualFallback(true);
                    setIsConnecting(false);
                    stopRecording();
                }
            }, 5000);

            try {
                await startRecording();
                if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
                setIsConnecting(false);
            } catch (err) {
                setManualFallback(true);
                setIsConnecting(false);
            }
        } else if (micState === 'recording') {
            stopRecording();
            setManualText(transcript);
            resetTranscript();
            setIsEditing(true);
        }
    };

    const handleGenerate = () => {
        if (text.trim() && !isProcessing) {
            onGenerate(text, includePlanning);
        }
    };

    const clearText = () => {
        setManualText('');
        setIsEditing(false);
        setManualFallback(false);
        resetTranscript();
    };

    const retryMic = () => {
        setManualFallback(false);
        handleMicClick();
    };

    return (
        <div className={cn('w-full max-w-3xl mx-auto space-y-4', className)}>
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
                        <div className="flex justify-between items-center mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn(
                                        'h-2 w-2 rounded-full animate-pulse',
                                        isFallback ? 'bg-amber-500' : 'bg-blue-500',
                                    )}
                                />
                                <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                    {isFallback ? t('manualEntry') : t('engine')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {isFallback && (
                                    <button
                                        onClick={retryMic}
                                        aria-label={t('ariaRetryConnection')}
                                        className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter italic"
                                    >
                                        <RefreshCcw size={12} />
                                        {t('ariaRetryMic')}
                                    </button>
                                )}
                                {text && (
                                    <button
                                        onClick={clearText}
                                        aria-label={t('ariaClearText')}
                                        className="text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                                    >
                                        <Eraser size={14} />
                                        {t('ariaClear')}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Main Input Zone */}
                        <div className="relative min-h-[140px] mb-4">
                            {/* Fallback Message */}
                            <AnimatePresence>
                                {isFallback && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4 overflow-hidden"
                                    >
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                            <AlertCircle size={14} />
                                            {t('microUnavailable')}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {micState === 'recording' ? (
                                <TranscriptionLiveView
                                    text={text}
                                    isRecording={true}
                                    onTextChange={setManualText}
                                    className="bg-transparent shadow-none border-none p-0 min-h-[140px]"
                                />
                            ) : (
                                <div className="relative group">
                                    <textarea
                                        ref={textareaRef}
                                        value={text}
                                        onChange={(e) => setManualText(e.target.value)}
                                        onFocus={() => setIsEditing(true)}
                                        placeholder=""
                                        aria-label={isFallback ? t('ariaManualInput') : t('ariaIdeaInput')}
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
                                                    className="text-xl font-medium text-slate-400 dark:text-slate-600 text-balance px-10"
                                                >
                                                    {isFallback
                                                        ? t('placeholderType')
                                                        : t('placeholderSpeak')}
                                                </motion.p>
                                                <Sparkles
                                                    className="text-blue-300 dark:text-blue-900/50 animate-bounce"
                                                    size={24}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Planning Toggle */}
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => setIncludePlanning(!includePlanning)}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
                                    includePlanning
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
                                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600',
                                )}
                            >
                                <CalendarDays size={16} />
                                {t('includePlanningLabel')}
                                <div
                                    className={cn(
                                        'h-5 w-9 rounded-full transition-colors relative',
                                        includePlanning
                                            ? 'bg-blue-500'
                                            : 'bg-slate-300 dark:bg-slate-700',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                                            includePlanning ? 'translate-x-4' : 'translate-x-0.5',
                                        )}
                                    />
                                </div>
                            </button>
                            {includePlanning && (
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                                    {t('planningHint')}
                                </span>
                            )}
                        </div>

                        {/* Bottom Controls */}
                        <div className="flex items-center justify-between border-t border-white/20 dark:border-white/5 pt-4">
                            <div className="flex items-center gap-4">
                                <MicButton
                                    state={micState}
                                    onClick={handleMicClick}
                                    className="h-14 w-14"
                                />
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                        {wordCount}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase">
                                        {t('words')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!text.trim() || micState === 'recording'}
                                aria-label={t('ariaGenerate')}
                                className={cn(
                                    'flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-lg',
                                    text.trim() && micState !== 'recording'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/20 scale-100 hover:scale-105'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700 cursor-not-allowed scale-95',
                                )}
                            >
                                <Send size={18} />
                                {t('generateRoadmapButton')}
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
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                className="h-full w-full bg-blue-600"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
