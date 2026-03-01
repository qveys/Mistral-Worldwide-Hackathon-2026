'use client';

import React from 'react';

// Settings Components
import { SettingsHeader } from '@/components/dashboard/settings/SettingsHeader';
import { ProfileSection } from '@/components/dashboard/settings/ProfileSection';
import { IntegrationSection } from '@/components/dashboard/settings/IntegrationSection';

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      
      <SettingsHeader />

      <div className="grid grid-cols-12 gap-4 auto-rows-auto">
        
        {/* Main Column */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <ProfileSection />
          <IntegrationSection />
        </div>

        {/* Side Column */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-linear-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-4xl p-8 space-y-4">
            <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest">Danger Zone</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
              La suppression de votre compte entraînera la perte immédiate de tous les clusters de roadmaps et des contextes neuraux synchronisés.
            </p>
            <button className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              Delete Workspace
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
