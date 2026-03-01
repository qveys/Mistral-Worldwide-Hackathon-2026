'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { API_URL } from '@/lib/api';
import { BrainDumpInput } from './BrainDumpInput';

export function QuickStart() {
    const router = useRouter();
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
                throw new Error((body as { error?: string }).error || `Server error: ${response.status}`);
            }
            const data = (await response.json()) as { projectId: string };
            router.push(`/project/${data.projectId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
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
