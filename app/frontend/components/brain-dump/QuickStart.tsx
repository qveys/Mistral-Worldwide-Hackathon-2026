'use client';

import type { LoginCredentials } from '@/components/ui/LoginForm';
import { LoginForm } from '@/components/ui/LoginForm';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { BrainDumpInput } from './BrainDumpInput';

export function QuickStart() {
    const router = useRouter();
    const { isLoggedIn, loginWithEmail } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    // Store the pending prompt so we can redirect after login
    const pendingPromptRef = useRef<{ text: string; includePlanning: boolean } | null>(null);

    const redirectToNew = useCallback(
        (text: string) => {
            const params = new URLSearchParams({ text });
            router.push(`/dashboard/roadmaps/new?${params.toString()}`);
        },
        [router],
    );

    const handleGenerate = useCallback(
        (text: string, includePlanning: boolean) => {
            if (!isLoggedIn) {
                pendingPromptRef.current = { text, includePlanning };
                setShowLoginModal(true);
                return;
            }
            // Already logged in → go straight to new roadmap page with text pre-filled
            redirectToNew(text);
        },
        [isLoggedIn, redirectToNew],
    );

    const handleLoginSubmit = useCallback(
        async (credentials: LoginCredentials) => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            setLoginError(null);
            const hasCredentials =
                credentials.email.trim().length > 0 && credentials.password.length > 0;
            if (hasCredentials) {
                const result = await loginWithEmail(credentials.email);
                if (!result.ok) {
                    setLoginError(result.error);
                    setIsSubmitting(false);
                    return;
                }
            }
            setIsSubmitting(false);
            setShowLoginModal(false);
            // Redirect to new roadmap page with pre-filled text
            if (pendingPromptRef.current) {
                const { text } = pendingPromptRef.current;
                pendingPromptRef.current = null;
                redirectToNew(text);
            }
        },
        [isSubmitting, loginWithEmail, redirectToNew],
    );

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <BrainDumpInput
                onGenerate={handleGenerate}
                className="shadow-2xl shadow-blue-500/5 border-2 border-slate-300 dark:border-zinc-600 rounded-[2rem] bg-white dark:bg-zinc-900/50"
            />

            {/* Login modal for unauthenticated users */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md"
                            onClick={() => setShowLoginModal(false)}
                            aria-hidden
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className={cn(
                                'relative w-full max-w-sm rounded-[2.5rem] p-8 shadow-xl',
                                'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600',
                            )}
                        >
                            {loginError && (
                                <p
                                    className="text-[10px] font-bold text-red-500 uppercase tracking-wider italic mb-4"
                                    role="alert"
                                >
                                    {loginError}
                                </p>
                            )}
                            <LoginForm onSubmit={handleLoginSubmit} isLoading={isSubmitting} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
