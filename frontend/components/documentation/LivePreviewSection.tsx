import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskCard } from '@/components/ui/TaskCard';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { MicButton, MicButtonState } from '@/components/ui/MicButton';
import { Card } from '@/components/ui/Card';
import { Sparkles, Play, Search, Settings, User, Bell, Mail, Trash2, Save } from 'lucide-react';

export const LivePreviewSection = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [micState, setMicState] = useState<MicButtonState>('idle');
  const [searchQuery, setSearchQuery] = useState('');

  const simulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  return (
    <motion.div 
      key="live-preview" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      <SectionHeader 
        title="Live Preview" 
        description="Exploration interactive de la bibliothèque de composants EchoMaps." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BUTTONS GALLERY */}
        <Card className="p-8 space-y-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Play size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Interactions</span>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" onClick={simulateLoading} isLoading={btnLoading}>
                Action Principale
              </Button>
              <Button variant="secondary">Action Secondaire</Button>
              <Button variant="danger">Zone Critique</Button>
              <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700">Custom Brand</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#ff4f00] hover:text-white transition-all group">
                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
              <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#ff4f00] hover:text-white transition-all">
                <Bell size={18} />
              </button>
              <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-[#ff4f00] hover:text-white transition-all">
                <User size={18} />
              </button>
              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 mx-2" />
              <MicButton state={micState} onClick={() => setMicState(micState === 'idle' ? 'recording' : 'idle')} className="scale-75" />
            </div>
          </div>
        </Card>

        {/* DATA DISPLAY & BADGES */}
        <Card className="p-8 space-y-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">États & Statuts</span>
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge variant="priority" type="high">Urgent</Badge>
              <Badge variant="priority" type="medium">Normal</Badge>
              <Badge variant="priority" type="low">Faible</Badge>
              <Badge variant="status" type="done">Terminé</Badge>
              <Badge variant="status" type="doing">En cours</Badge>
              <Badge variant="status" type="backlog">Backlog</Badge>
              <Badge variant="estimate">Size: XL</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <TaskCard 
                task={{ 
                  id: "demo-1", 
                  title: "Finaliser l'interface de documentation", 
                  status: "doing", 
                  priority: "high", 
                  estimate: "M" 
                }} 
                onStatusChange={() => {}} 
              />
              <TaskCard 
                task={{ 
                  id: "demo-2", 
                  title: "Optimiser les performances STT", 
                  status: "backlog", 
                  priority: "medium", 
                  estimate: "L" 
                }} 
                isBlocked
                blockedBy={["API Mistral Cloud"]}
                onStatusChange={() => {}} 
              />
            </div>
          </div>
        </Card>

        {/* INPUTS & SEARCH */}
        <Card className="p-8 space-y-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-slate-200/50 dark:border-white/5 lg:col-span-2">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Search size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Saisie de données</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <Input 
                label="Nom du Projet" 
                placeholder="EchoMaps v2" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Input 
                label="Tags" 
                placeholder="AI, Product, Launch" 
                description="Séparez les tags par des virgules."
              />
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Email de contact" 
                placeholder="dev@echo.maps" 
                type="email"
                error={searchQuery.length > 0 && !searchQuery.includes('@') ? "Email invalide" : undefined}
              />
              <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-3">Sélection Rapide</span>
                <div className="flex gap-2">
                  {['Web', 'Mobile', 'API'].map(t => (
                    <button key={t} className="px-3 py-1.5 bg-white dark:bg-black/40 rounded-lg text-[10px] font-bold dark:text-white border border-slate-200 dark:border-white/10 hover:border-orange-500 transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                <div className="flex items-center gap-3">
                  <Spinner size="sm" className="text-orange-500" />
                  <span className="text-[10px] font-black uppercase italic dark:text-white">Traitement...</span>
                </div>
                <Badge variant="status" type="doing">Active</Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 gap-2">
                  <Mail size={14} /> Inbox
                </Button>
                <Button variant="danger" className="p-3">
                  <Trash2 size={16} />
                </Button>
                <Button variant="primary" className="p-3">
                  <Save size={16} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </motion.div>
  );
};
