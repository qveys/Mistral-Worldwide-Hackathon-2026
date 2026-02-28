import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Card } from '@/components/ui/Card';
import { Mic, Brain, Network, Layout, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Mic,
    title: "Capture & STT",
    description: "La voix de l'utilisateur est capturée en temps réel via Web Audio API et transformée en texte brut via l'API Mistral (Voxtral).",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    icon: Brain,
    title: "Intelligence Mistral",
    description: "Le texte brut est analysé par l'IA (Mistral 7B/Mistral Large) pour extraire les objectifs, tâches, priorités et estimations.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: Network,
    title: "Graphe de Dépendances",
    description: "Les tâches sont liées logiquement pour former un graphe acyclique dirigé (DAG), identifiant les goulots d'étranglement.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    icon: Layout,
    title: "Visualisation",
    description: "La donnée structurée est rendue sous forme de timeline interactive et de graphe visuel dynamique (EchoMaps UI).",
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
];

export const MethodologySection = () => (
  <motion.div 
    key="methodology" 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -20 }}
    className="space-y-12"
  >
    <SectionHeader 
      title="Méthodologie" 
      description="Le flux de transformation d'une pensée désordonnée en un plan d'action structuré." 
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {steps.map((step, index) => (
        <Card key={index} className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-lg dark:shadow-xl flex flex-col gap-6 relative group overflow-hidden">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <step.icon size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Étape 0{index + 1}</span>
              <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white leading-tight font-bold">{step.title}</h3>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
            {step.description}
          </p>
          <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff4f00] opacity-0 group-hover:opacity-100 transition-opacity">
            Détails techniques <ArrowRight size={12} />
          </div>
          <div className="absolute top-0 right-0 p-8 text-8xl font-black italic text-slate-100 dark:text-white/5 -z-10 group-hover:-translate-y-2 transition-transform">
            0{index + 1}
          </div>
        </Card>
      ))}
    </div>

    {/* Philosophy Box */}
    <div className="bg-[#ff4f00] rounded-[3rem] p-12 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden">
      <div className="relative z-10 space-y-4 max-w-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-tight">La Philosophie EchoMaps</h3>
        <p className="text-lg font-medium opacity-90 leading-relaxed">
          Nous croyons que l&apos;intelligence artificielle ne doit pas seulement &quot;discuter&quot;, mais **structurer**. EchoMaps élimine la friction entre l&apos;idée et l&apos;exécution en automatisant l&apos;organisation mentale.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          {['Simplicité', 'Vitesse', 'Clarté', 'Action'].map(v => (
            <div key={v} className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={14} /> {v}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -right-20 -bottom-20 opacity-10">
        <Brain size={400} />
      </div>
    </div>
  </motion.div>
);
