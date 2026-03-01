'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { User, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ProfileSection() {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('profile');

  return (
    <div className={cn(
      "rounded-[2.5rem] p-8 lg:p-10 space-y-8",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className={cn("flex items-center gap-3 border-b pb-6", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
        <User size={18} className="text-violet-500" />
        <h3 className={cn("text-sm font-bold uppercase tracking-widest", isDarkMode ? "text-white" : "text-slate-900")}>{t('identityProfile')}</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "h-24 w-24 rounded-[2rem] flex items-center justify-center relative group cursor-pointer transition-all",
            isDarkMode ? "bg-zinc-800 text-zinc-500 border border-zinc-700/50 hover:border-[#536dfe]/50" : "bg-slate-100 text-slate-500 border border-slate-300 hover:border-[#536dfe]/50"
          )}>
            <User size={40} />
            <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <p className={cn("text-[10px] font-bold uppercase tracking-tighter", isDarkMode ? "text-zinc-600" : "text-slate-600")}>{t('clickToChange')}</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="displayName" className={cn("text-[10px] font-bold uppercase tracking-widest ml-1", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{t('displayName')}</label>
            <Input id="displayName" defaultValue={t('defaultDisplayName')} className={cn("h-12", isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-slate-50 border-slate-300")} />
          </div>
          <div className="space-y-2">
            <label htmlFor="emailAddress" className={cn("text-[10px] font-bold uppercase tracking-widest ml-1", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{t('emailAddress')}</label>
            <Input id="emailAddress" defaultValue={t('defaultEmail')} className={cn("h-12", isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-slate-50 border-slate-300")} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="bioTextarea" className={cn("text-[10px] font-bold uppercase tracking-widest ml-1", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{t('professionalBio')}</label>
            <textarea
              id="bioTextarea"
              className={cn(
                "w-full rounded-xl p-4 text-sm outline-none focus:border-[#536dfe]/50 transition-all h-24",
                isDarkMode ? "bg-zinc-900/50 border border-zinc-800 text-zinc-300" : "bg-slate-50 border border-slate-300 text-slate-700"
              )}
              placeholder={t('bioPlaceholder')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button className={cn(
          "rounded-full px-8 h-11 font-bold uppercase tracking-widest text-[10px]",
          isDarkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-slate-900 text-white hover:bg-slate-800"
        )}>
          {t('updateProfile')}
        </Button>
      </div>
    </div>
  );
}
