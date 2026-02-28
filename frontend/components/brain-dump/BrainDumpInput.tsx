'use client';

import { useVoxtralSTT } from '@/lib/useVoxtralSTT';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Eraser, Send, Sparkles, AlertCircle, RefreshCcw } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { MicButton, MicButtonState } from '../ui/MicButton';
import { TranscriptionLiveView } from './TranscriptionLiveView';

interface BrainDumpInputProps {
    onGenerate: (text: string) => void;
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
    const [isFallback, setIsFallback] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        transcript,
        isStreaming,
        error: sttError,
        startRecording,
        stopRecording,
        resetTranscript,
    } = useVoxtralSTT();

    // Reset fallback if error is cleared or new recording starts successfully
    useEffect(() => {
        if (sttError) {
            setIsFallback(true);
            setIsConnecting(false);
            if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
        }
    }, [sttError]);

    // Derive micState
    const micState: MicButtonState = isStreaming ? 'recording' : (isConnecting ? 'processing' : 'idle');

    // Merge: prioritize live transcript, then manual text
    const text = transcript || manualText;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    const handleMicClick = async () => {
        if (micState === 'idle') {
            setIsConnecting(true);
            setIsFallback(false);
            resetTranscript();
            setManualText('');

            // Timeout logic: if no streaming after 5s, trigger fallback
            connectionTimeoutRef.current = setTimeout(() => {
                if (!isStreaming) {
                    setIsFallback(true);
                    setIsConnecting(false);
                    stopRecording();
                }
            }, 5000);

            try {
                await startRecording();
                if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
                setIsConnecting(false);
            } catch (err) {
                setIsFallback(true);
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
            onGenerate(text);
        }
    };

    const clearText = () => {
        setManualText('');
        setIsEditing(false);
        setIsFallback(false);
        resetTranscript();
    };

    const retryMic = () => {
        setIsFallback(false);
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
                                <div className={cn(
                                    "h-2 w-2 rounded-full animate-pulse",
                                    isFallback ? "bg-amber-500" : "bg-blue-500"
                                )} />
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    {isFallback ? 'Saisie Manuelle' : 'Brain Dump Engine'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {isFallback && (
                                    <button 
                                        onClick={retryMic}
                                        className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter italic"
                                    >
                                        <RefreshCcw size={12} />
                                        Réessayer le micro
                                    </button>
                                )}
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
                                            Micro indisponible — saisie texte activée
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
                                                    {isFallback ? 'Tapez votre idée ici...' : 'Parlez ou écrivez ici...'}
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
                                        Mots
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!text.trim() || micState === 'recording'}
                                className={cn(
                                    'flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-lg',
                                    text.trim() && micState !== 'recording'
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/20 scale-100 hover:scale-105'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700 cursor-not-allowed scale-95',
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
