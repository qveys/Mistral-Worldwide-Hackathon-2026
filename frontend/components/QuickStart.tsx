'use client';

import { useRouter } from 'next/navigation';
import { BrainDumpInput } from './BrainDumpInput';

export function QuickStart() {
  const router = useRouter();

  const handleGenerate = (text: string) => {
    const id = crypto.randomUUID();
    // On encode le texte pour le passer au projet
    router.push(`/project/${id}?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      <BrainDumpInput 
        onGenerate={handleGenerate} 
        className="shadow-2xl shadow-orange-500/5 border-slate-200/60"
      />
    </div>
  );
}
