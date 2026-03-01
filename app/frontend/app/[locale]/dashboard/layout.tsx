'use client';

import { DashboardBreadcrumb } from '@/components/dashboard/DashboardBreadcrumb';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import type { LoginCredentials } from '@/components/ui/LoginForm';
import { LoginForm } from '@/components/ui/LoginForm';
import { usePathname } from '@/i18n/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

function DashboardLayoutInner({
    children,
    isCollapsed,
    onToggleCollapse,
}: {
    children: React.ReactNode;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}) {
    const { isDarkMode } = useDashboardTheme();

    return (
        <div
            className={cn(
                'min-h-screen flex font-sans transition-colors duration-500',
                isDarkMode ? 'dark bg-[#09090b] text-zinc-400' : 'bg-slate-50 text-slate-700',
                isDarkMode ? 'selection:bg-[#536dfe]/30' : 'selection:bg-[#00b0ff]/30',
            )}
        >
            <DashboardSidebar isCollapsed={isCollapsed} onToggle={onToggleCollapse} />

            <main className="flex-1 overflow-y-auto">
                <DashboardBreadcrumb />
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { isLoggedIn, loginWithEmail } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const isNewRoadmapPage = pathname?.includes('roadmaps/new') ?? false;

    const handleLoginSubmit = async (credentials: LoginCredentials) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setLoginError(null);
        const hasCredentials =
            credentials.email.trim().length > 0 && credentials.password.length > 0;
        if (hasCredentials) {
            const result = await loginWithEmail(credentials.email);
            if (!result.ok) {
                setLoginError(result.error);
            }
        }
        setIsSubmitting(false);
    };

    if (!isLoggedIn && !isNewRoadmapPage) {
        return (
            <div
                className={cn(
                    'min-h-screen flex items-center justify-center font-sans transition-colors duration-500 px-4',
                    'bg-slate-50 dark:bg-[#09090b] text-slate-700 dark:text-zinc-400',
                )}
            >
                <div
                    className={cn(
                        'w-full max-w-sm rounded-[2.5rem] p-8 shadow-lg dark:shadow-xl',
                        'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600',
                    )}
                >
                    <LoginForm onSubmit={handleLoginSubmit} isLoading={isSubmitting} />
                </div>
            </div>
        );
    }

    return (
        <DashboardLayoutInner
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        >
            {children}
        </DashboardLayoutInner>
    );
}
