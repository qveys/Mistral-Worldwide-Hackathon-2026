'use client';

import React from 'react';
import { Layout, Bell, Globe, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PreferencesSection() {
  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700/50 pb-6">
        <Layout size={18} className="text-blue-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Console Interface</h3>
      </div>

      <div className="space-y-6">
        {[
          { label: "Neural Highlighting", desc: "Met en évidence les dépendances critiques dans le graphe.", icon: Moon, active: true },
          { label: "Real-time Activity Log", desc: "Affiche les flux de tokens et les logs d'inférence.", icon: Globe, active: true },
          { label: "Audio Feedback", desc: "Indicateurs sonores lors de la capture vocale.", icon: Bell, active: false },
        ].map((pref, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <pref.icon size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{pref.label}</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 ml-6">{pref.desc}</p>
            </div>
            <button className={cn(
              "w-10 h-5 rounded-full transition-all relative",
              pref.active
                ? "bg-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                : "bg-slate-300 dark:bg-slate-800"
            )}>
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                pref.active ? "right-1" : "left-1"
              )} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
