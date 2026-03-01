'use client';

import { BrainDumpInput } from '@/components/brain-dump/BrainDumpInput';
import { useRouter } from '@/i18n/navigation';
import { API_URL } from '@/lib/api';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { getErrorMessageKey } from '@/lib/errorMessages';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function NewRoadmapPage() {
    const router = useRouter();
    const { isDarkMode } = useDashboardTheme();
    const t = useTranslations('dashboard');
    const tErrors = useTranslations('errors');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (text: string, includePlanning: boolean) => {
        setError(null);
        setIsProcessing(true);
        try {
            const response = await fetch(`${API_URL}/structure`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, includePlanning }),
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                const apiError = (body as { error?: string }).error;
                const key = apiError ? getErrorMessageKey(apiError) : null;
                throw new Error(key ? tErrors(key) : tErrors('failedGenerateRoadmap'));
            }
            const data = (await response.json()) as { projectId?: unknown };
            if (typeof data.projectId !== 'string' || data.projectId.trim() === '') {
                throw new Error(tErrors('failedGenerateRoadmap'));
            }
            router.push(`/project/${encodeURIComponent(data.projectId)}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : null;
            const key = getErrorMessageKey(message);
            setError(key ? tErrors(key) : message || tErrors('failedGenerateRoadmap'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className={cn(
                'min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-6 lg:p-10',
                isDarkMode ? 'bg-transparent' : 'bg-transparent',
            )}
        >
            <div className="w-full max-w-2xl">
                <div
                    className={cn(
                        'p-8 lg:p-10 rounded-4xl',
                        isDarkMode
                            ? 'bg-[#161618] border border-zinc-800/50'
                            : 'bg-white border-2 border-slate-300 shadow-lg',
                    )}
                >
                    <h1
                        className={cn(
                            'text-2xl font-bold tracking-tight mb-2 text-center',
                            isDarkMode ? 'text-white' : 'text-slate-900',
                        )}
                    >
                        {t('newBrainDump')}
                    </h1>
                    <p
                        className={cn(
                            'text-sm text-center mb-8',
                            isDarkMode ? 'text-zinc-500' : 'text-slate-600',
                        )}
                    >
                        {t('newRoadmapDescription')}
                    </p>
                    {error && (
                        <p className="text-sm text-red-500 mb-4 text-center" role="alert">
                            {error}
                        </p>
                    )}
                    <BrainDumpInput onGenerate={handleGenerate} isProcessing={isProcessing} />
                </div>
            </div>
        </div>
    );
}
