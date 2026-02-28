import { Metadata } from 'next';
import { Zap } from 'lucide-react';
import { QuickStart } from '@/components/brain-dump/QuickStart';

export const metadata: Metadata = {
  title: 'EchoMaps | Chaos to Clarity',
  description: 'Transformez vos idées en roadmaps structurées grâce au Brain Dump Engine.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter italic">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-[#ff4f00] rounded-sm rotate-45" />
          </div>
          ECHOMAPS
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <a href="#" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">Methodology</a>
          <a href="/documentation" className="px-4 py-2 rounded-full bg-orange-50 text-[#ff4f00] font-bold border border-orange-100 hover:bg-orange-100 transition-all duration-300">Documentation</a>
          <a href="#" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">API</a>
          <div className="h-4 w-[1px] bg-slate-200 mx-2" />
          <a href="https://github.com" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">GitHub</a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* --- HERO --- */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <Zap size={10} className="text-[#ff4f00] fill-[#ff4f00]" />
            Powered by Mistral Large 2
          </div>
          
          <h1 className="text-7xl md:text-9xl font-medium tracking-tight text-black leading-[0.85]">
            Chaos to <span className="italic font-serif text-[#ff4f00]">Clarity.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light text-balance">
            Capturez vos flux de pensée désordonnés. <br className="hidden md:block"/>
            Notre IA les transforme en roadmaps d&apos;ingénierie impeccables.
          </p>
        </div>

        {/* --- BRAIN DUMP ENGINE (The Quick Start) --- */}
        <div className="w-full max-w-3xl">
          <QuickStart />
        </div>

        {/* --- FOOTER GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-8 opacity-60">
          <div className="text-left space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-black underline decoration-[#ff4f00] decoration-2 underline-offset-4">01. Voice-to-Task</div>
            <p className="text-[13px] text-slate-500 leading-snug">Parlez naturellement, nous extrayons les actions prioritaires et les dépendances techniques.</p>
          </div>
          <div className="text-left space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-black underline decoration-[#ff4f00] decoration-2 underline-offset-4">02. Neural Mapping</div>
            <p className="text-[13px] text-slate-500 leading-snug">L&apos;IA structure vos idées selon les standards de gestion de projet agiles les plus rigoureux.</p>
          </div>
          <div className="text-left space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-black underline decoration-[#ff4f00] decoration-2 underline-offset-4">03. Iterative refine</div>
            <p className="text-[13px] text-slate-500 leading-snug">Affinez votre vision en dialoguant avec la roadmap pour ajuster les délais et les objectifs.</p>
          </div>
        </div>
      </main>

      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px] -z-0 pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px] -z-0 pointer-events-none" />
    </div>
  );
}
