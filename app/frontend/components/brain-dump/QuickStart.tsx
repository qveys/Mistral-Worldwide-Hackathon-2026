'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { API_URL } from '@/lib/api';
import { getErrorMessageKey } from '@/lib/errorMessages';
import { BrainDumpInput } from './BrainDumpInput';

export function QuickStart() {
    const router = useRouter();
    const tErrors = useTranslations('errors');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
                throw new Error(key ? tErrors(key) : apiError || tErrors('failedGenerateRoadmap'));
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
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {error && (
                <p className="text-sm text-red-500 mb-4" role="alert">
                    {error}
                </p>
            )}
            <BrainDumpInput
                onGenerate={handleGenerate}
                isProcessing={isProcessing}
                className="shadow-2xl shadow-blue-500/5 border-2 border-slate-300 rounded-[2rem]"
            />
        </div>
    );
}
