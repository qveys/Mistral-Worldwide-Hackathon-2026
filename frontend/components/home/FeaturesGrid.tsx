'use client';

import React from 'react';
import { Mic, Network, RefreshCcw } from 'lucide-react';

const features = [
  {
    number: "01",
    title: "Voice-to-Task",
    desc: "Parlez naturellement, nous extrayons les actions prioritaires et les dépendances techniques.",
    icon: Mic
  },
  {
    number: "02",
    title: "Neural Mapping",
    desc: "L'IA structure vos idées selon les standards de gestion de projet agiles les plus rigoureux.",
    icon: Network
  },
  {
    number: "03",
    title: "Iterative refine",
    desc: "Affinez votre vision en dialoguant avec la roadmap pour ajuster les délais et les objectifs.",
    icon: RefreshCcw
  }
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-4">
      {features.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.number} className="text-left space-y-3">
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-blue-600" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                {f.number}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight underline decoration-blue-600 decoration-2 underline-offset-4">
              {f.title}
            </h3>
            <p className="text-base text-slate-600 leading-relaxed">{f.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
