'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('doc');
  const tTask = useTranslations('taskCard');
  const tActions = useTranslations('actions');
  const tTimeline = useTranslations('timeline');
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
        title={t('livePreview')} 
        description={t('sectionLivePreviewDescription')} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BUTTONS GALLERY */}
        <Card className="p-8 space-y-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-lg dark:shadow-xl">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Play size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">{t('interactions')}</span>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" onClick={simulateLoading} isLoading={btnLoading}>
                {t('actionPrimary')}
              </Button>
              <Button variant="secondary">{t('actionSecondary')}</Button>
              <Button variant="danger">{t('zoneCritique')}</Button>
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">{t('customBrand')}</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all group">
                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
              <button className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                <Bell size={18} />
              </button>
              <button className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                <User size={18} />
              </button>
              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 mx-2" />
              <MicButton state={micState} onClick={() => setMicState(micState === 'idle' ? 'recording' : 'idle')} className="scale-75" />
            </div>
          </div>
        </Card>

        {/* DATA DISPLAY & BADGES */}
        <Card className="p-8 space-y-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-lg dark:shadow-xl">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">{t('statesAndStatuses')}</span>
          </div>

          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge variant="priority" type="high">{tTask('priorityHigh')}</Badge>
              <Badge variant="priority" type="medium">{t('normal')}</Badge>
              <Badge variant="priority" type="low">{tTask('priorityLow')}</Badge>
              <Badge variant="status" type="done">{tTask('completed')}</Badge>
              <Badge variant="status" type="doing">{tTask('inProgress')}</Badge>
              <Badge variant="status" type="backlog">{tActions('backlog')}</Badge>
              <Badge variant="estimate">Size: XL</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <TaskCard 
                task={{ 
                  id: "demo-1", 
                  title: t('demoTask1Title'), 
                  status: "doing", 
                  priority: "high", 
                  estimate: "M" 
                }} 
                onStatusChange={() => {}} 
              />
              <TaskCard 
                task={{ 
                  id: "demo-2", 
                  title: t('demoTask2Title'), 
                  status: "backlog", 
                  priority: "medium", 
                  estimate: "L" 
                }} 
                isBlocked
                blockedBy={[t('demoBlockedBy')]}
                onStatusChange={() => {}} 
              />
            </div>
          </div>
        </Card>

        {/* INPUTS & SEARCH */}
        <Card className="p-8 space-y-8 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-lg dark:shadow-xl lg:col-span-2">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Search size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">{t('dataInput')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <Input 
                label={t('projectName')} 
                placeholder={t('projectNamePlaceholder')} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Input 
                label={t('tags')} 
                placeholder={t('tagsPlaceholder')} 
                description={t('tagsSeparateHint')}
              />
            </div>
            
            <div className="space-y-4">
              <Input 
                label={t('contactEmail')} 
                placeholder={t('contactEmailPlaceholder')} 
                type="email"
                error={searchQuery.length > 0 && !searchQuery.includes('@') ? t('emailInvalid') : undefined}
              />
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl border-2 border-slate-200 dark:border-slate-600">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-3">{t('quickSelect')}</span>
                <div className="flex gap-2">
                  {[t('web'), t('mobile'), t('api')].map((label) => (
                    <button key={label} className="px-3 py-1.5 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-[10px] font-bold dark:text-white border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <div className="flex items-center gap-3">
                  <Spinner size="sm" className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase italic dark:text-white">{t('processing')}</span>
                </div>
                <Badge variant="status" type="doing">{tTimeline('statusActive')}</Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 gap-2">
                  <Mail size={14} /> {t('inbox')}
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
