'use client';

import React from 'react';

const features = [
  {
    number: "01",
    title: "Voice-to-Task",
    desc: "Parlez naturellement, nous extrayons les actions prioritaires et les dépendances techniques."
  },
  {
    number: "02",
    title: "Neural Mapping",
    desc: "L'IA structure vos idées selon les standards de gestion de projet agiles les plus rigoureux."
  },
  {
    number: "03",
    title: "Iterative refine",
    desc: "Affinez votre vision en dialoguant avec la roadmap pour ajuster les délais et les objectifs."
  }
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-8 opacity-60">
      {features.map((f) => (
        <div key={f.number} className="text-left space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-black underline decoration-[#ff4f00] decoration-2 underline-offset-4">
            {f.number}. {f.title}
          </div>
          <p className="text-[13px] text-slate-500 leading-snug">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
