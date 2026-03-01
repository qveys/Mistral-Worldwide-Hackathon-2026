'use client';

import { useRouter } from '@/i18n/navigation';
import { BrainDumpInput } from './BrainDumpInput';

export function QuickStart() {
    const router = useRouter();

    const handleGenerate = (text: string, includePlanning: boolean) => {
        const id = crypto.randomUUID();
        // encoding text and includePlanning as query params to pass to the project page
        const params = new URLSearchParams({ text });
        if (includePlanning) params.set('planning', '1');
        router.push(`/project/${id}?${params.toString()}`);
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <BrainDumpInput
                onGenerate={handleGenerate}
                className="shadow-2xl shadow-blue-500/5 border-2 border-slate-300 rounded-[2rem]"
            />
        </div>
    );
}
