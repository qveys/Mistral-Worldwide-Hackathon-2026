'use client';

import React from 'react';
import { Zap, Eye, EyeOff, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function IntegrationSection() {
  const [showKey, setShowKey] = React.useState(false);

  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">AI Integrations</h3>
        </div>
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Connection</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Mistral Integration */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center border border-zinc-800">
                <div className="w-5 h-5 bg-[#ff4f00] rounded-sm rotate-45" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Mistral Large 2</h4>
                <p className="text-[10px] text-zinc-500 font-mono">Primary Neural Engine</p>
              </div>
            </div>
            <Button variant="ghost" className="text-zinc-500 hover:text-white h-8 text-[9px] uppercase font-black">Change Model</Button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">API Key Cluster</label>
            <div className="relative">
              <Input 
                type={showKey ? "text" : "password"} 
                defaultValue="mst-482-99-x-alpha-bravo-tango" 
                className="bg-black/50 border-zinc-800 h-12 pr-12 font-mono text-xs" 
                readOnly
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* AWS Bedrock Fallback */}
        <div className="p-6 border border-zinc-800 border-dashed rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-zinc-900/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-amber-500 transition-colors">
              <Cpu size={20} />
            </div>
            <div>
              <h4 className="text-zinc-400 font-bold text-sm group-hover:text-white transition-colors">AWS Bedrock Fallback</h4>
              <p className="text-[10px] text-zinc-600 font-mono">Configure secondary inference unit</p>
            </div>
          </div>
          <Button variant="ghost" className="h-8 border border-zinc-800 rounded-lg text-[9px] font-black uppercase text-zinc-500 hover:text-white">Configure</Button>
        </div>
      </div>
    </div>
  );
}
