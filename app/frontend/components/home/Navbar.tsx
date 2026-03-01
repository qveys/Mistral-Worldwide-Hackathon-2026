'use client';

import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import type { LoginCredentials } from '@/components/ui/LoginForm';
import { LoginForm } from '@/components/ui/LoginForm';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, LogOut, Moon, Sun, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';

export function Navbar() {
    const t = useTranslations('nav');
    const tDoc = useTranslations('doc');
    const { isLoggedIn, logout, loginWithEmail } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    // Where to redirect after login (null = just close modal)
    const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const openLoginModal = (redirect?: string) => {
        setPostLoginRedirect(redirect ?? null);
        setLoginError(null);
        setShowLoginModal(true);
    };

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
            if (postLoginRedirect) {
                router.push(postLoginRedirect);
            }
        },
        [isSubmitting, loginWithEmail, postLoginRedirect, router],
    );

    const handleCreateRoadmapClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            openLoginModal('/dashboard/roadmaps/new');
        }
    };

    return (
        <>
            <nav className="pt-12 pb-8 px-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-black text-xl tracking-tighter italic text-slate-900 dark:text-white"
                >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
                        <Image
                            src="/logo.png"
                            alt="EchoMaps"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    ECHOMAPS
                </Link>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-zinc-400">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                    >
                        {t('console')}
                    </Link>
                    <Link
                        href="/dashboard/roadmaps/new"
                        onClick={handleCreateRoadmapClick}
                        className="px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                    >
                        {t('createRoadmap')}
                    </Link>
                    <Link
                        href="/documentation"
                        className="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-2 border-slate-300 dark:border-zinc-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-300"
                    >
                        {tDoc('documentation')}
                    </Link>
                    <div className="h-4 w-px bg-slate-300 dark:bg-zinc-600 mx-2" />
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300"
                        aria-label={isDarkMode ? t('themeLight') : t('themeDark')}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <LanguageSwitcher className="shrink-0" />
                    <a
                        href="https://github.com/qveys/Mistral-Worldwide-Hackathon-2026"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('github')}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                    >
                        <Github size={20} />
                    </a>
                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label={t('logout')}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300"
                        >
                            <LogOut size={20} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openLoginModal()}
                            aria-label={t('login')}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all duration-300"
                        >
                            <User size={20} />
                        </button>
                    )}
                </div>
            </nav>

            {/* Login modal */}
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
        </>
    );
}
