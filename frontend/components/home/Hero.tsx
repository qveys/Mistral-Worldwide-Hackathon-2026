'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export function Hero() {
  return (
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
  );
}
