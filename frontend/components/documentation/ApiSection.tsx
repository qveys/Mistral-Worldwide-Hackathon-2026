import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Terminal, Copy, Globe, Lock, Code2, Zap } from 'lucide-react';

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/transcribe",
    desc: "Transforme un flux audio ou un fichier en texte brut structuré.",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/roadmap/generate",
    desc: "Génère une roadmap complète à partir d'un texte brut.",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/v1/roadmap/:id",
    desc: "Récupère les détails d'une roadmap spécifique et son graphe.",
    auth: false,
  }
];

export const ApiSection = () => (
  <motion.div 
    key="api" 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -20 }}
    className="space-y-12"
  >
    <SectionHeader 
      title="API Reference" 
      description="Intégrez la puissance du Brain Dump Engine dans vos propres outils." 
    />

    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden relative group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Quick Start SDK</span>
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <Copy size={16} />
          </button>
        </div>
        <pre className="text-blue-400 font-mono text-sm leading-relaxed overflow-x-auto no-scrollbar">
          {`const echomaps = new EchoMaps(process.env.ECHOMAPS_KEY);

// Start the brain dump session
const roadmap = await echomaps.brainDump.generate({
  audioStream: micStream,
  context: "Engineering Launch 2026",
  options: { includeGraph: true }
});`}
        </pre>
        <Zap className="absolute -right-8 -bottom-8 text-white/5 group-hover:text-orange-500/10 transition-colors" size={240} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {endpoints.map((ep, i) => (
          <Card key={i} className="p-6 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-lg dark:shadow-xl hover:border-orange-500/30 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  ep.method === 'POST' ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                )}>
                  {ep.method}
                </span>
                <code className="text-sm font-bold text-slate-800 dark:text-white font-mono">{ep.path}</code>
              </div>
              <div className="flex items-center gap-3">
                {ep.auth && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-[9px] font-black uppercase text-slate-400">
                    <Lock size={10} /> API Key
                  </div>
                )}
                <Badge variant="status" type="done">Stable</Badge>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200 font-medium">
              {ep.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-8 bg-indigo-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-indigo-200 dark:border-slate-600 shadow-lg dark:shadow-xl space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
          <Globe size={24} />
        </div>
        <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white font-bold">Webhooks</h4>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Recevez des notifications en temps réel lorsque la génération d&apos;une roadmap est terminée ou si une action nécessite une intervention manuelle.
        </p>
      </div>
      <div className="p-8 bg-blue-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-blue-200 dark:border-slate-600 shadow-lg dark:shadow-xl space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
          <Code2 size={24} />
        </div>
        <h4 className="text-lg font-black uppercase italic text-slate-900 dark:text-white font-bold">Custom LLM</h4>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Option pour utiliser vos propres modèles Mistral ou configurer des prompts système personnalisés via l&apos;API.
        </p>
      </div>
    </div>
  </motion.div>
);
