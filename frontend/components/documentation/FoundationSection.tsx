import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Command } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';

export const FoundationSection = () => (
  <motion.div key="foundation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
    <SectionHeader title="Design System" description="Atomes et fondations graphiques de l'interface." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
        <div className="flex items-center gap-2 text-[#ff4f00]"><MousePointer2 size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">Atomes UI</span></div>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Principal</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" isLoading>Wait</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="priority" type="high">Urgent</Badge>
          <Badge variant="status" type="doing">In Progress</Badge>
          <Badge variant="estimate">Size: M</Badge>
          <Spinner size="md" className="text-[#ff4f00] ml-2" />
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-500"><Command size={16} /><span className="text-[10px] font-black uppercase tracking-widest italic">Formulaire</span></div>
        <Input label="Roadmap Name" placeholder="Ex: Launch Project" />
        <Input label="Email" placeholder="user@echo.maps" error="Email invalide" />
      </div>
    </div>
  </motion.div>
);
