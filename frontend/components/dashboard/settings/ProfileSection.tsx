'use client';

import React from 'react';
import { User, Camera, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ProfileSection() {
  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
        <User size={18} className="text-violet-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Identity Profile</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-24 w-24 bg-zinc-800 rounded-[2rem] flex items-center justify-center text-zinc-500 relative group cursor-pointer border border-zinc-700/50 hover:border-violet-500/50 transition-all">
            <User size={40} />
            <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Click to change</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Display Name</label>
            <Input defaultValue="Product Lead" className="bg-zinc-900/50 border-zinc-800 h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <Input defaultValue="lead@echomaps.ai" className="bg-zinc-900/50 border-zinc-800 h-12" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Professional Bio</label>
            <textarea 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-violet-500/50 transition-all h-24"
              placeholder="Architecting the future of neural roadmaps..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button className="bg-white text-black hover:bg-zinc-200 rounded-xl px-8 h-11 font-bold uppercase tracking-widest text-[10px]">
          Update Profile
        </Button>
      </div>
    </div>
  );
}
