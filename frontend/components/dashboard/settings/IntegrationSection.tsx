'use client';

import React from 'react';
import { Zap, Eye, EyeOff, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function IntegrationSection() {
  const [showKey, setShowKey] = React.useState(false);
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className={cn(
      "rounded-[2.5rem] p-8 lg:p-10 space-y-8",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className={cn("flex items-center justify-between border-b pb-6", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-amber-500" />
          <h3 className={cn("text-sm font-bold uppercase tracking-widest", isDarkMode ? "text-white" : "text-slate-900")}>AI Integrations</h3>
        </div>
        <div className="flex gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className={cn("text-[10px] font-mono uppercase", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Live Connection</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Mistral Integration */}
        <div className={cn(
          "p-6 rounded-2xl space-y-6",
          isDarkMode ? "bg-zinc-900/50 border border-zinc-800" : "bg-slate-50 border border-slate-300"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                isDarkMode ? "bg-black border border-zinc-800" : "bg-black border border-slate-300"
              )}>
                <div className="w-5 h-5 bg-[#ff4f00] rounded-sm rotate-45" />
              </div>
              <div>
                <h4 className={cn("font-bold text-sm", isDarkMode ? "text-white" : "text-slate-900")}>Mistral Large 2</h4>
                <p className={cn("text-[10px] font-mono", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Primary Neural Engine</p>
              </div>
            </div>
            <Button variant="ghost" className={cn("h-8 text-[9px] uppercase font-black", isDarkMode ? "text-zinc-500 hover:text-white" : "text-slate-600 hover:text-slate-900")}>Change Model</Button>
          </div>

          <div className="space-y-2">
            <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-1", isDarkMode ? "text-zinc-600" : "text-slate-600")}>API Key Cluster</label>
            <div className="relative">
              <Input 
                type={showKey ? "text" : "password"} 
                defaultValue="mst-482-99-x-alpha-bravo-tango" 
                className={cn("h-12 pr-12 font-mono text-xs", isDarkMode ? "bg-black/50 border-zinc-800" : "bg-white border-slate-300")}
                readOnly
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className={cn("absolute right-4 top-1/2 -translate-y-1/2 transition-colors", isDarkMode ? "text-zinc-600 hover:text-white" : "text-slate-500 hover:text-slate-900")}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* AWS Bedrock Fallback */}
        <div className={cn(
          "p-6 border border-dashed rounded-2xl flex items-center justify-between group cursor-pointer transition-all",
          isDarkMode ? "border-zinc-800 hover:bg-zinc-900/20" : "border-slate-300 hover:bg-slate-50"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
              isDarkMode ? "bg-zinc-800 text-zinc-500 group-hover:text-amber-500" : "bg-slate-200 text-slate-500 group-hover:text-amber-500"
            )}>
              <Cpu size={20} />
            </div>
            <div>
              <h4 className={cn("font-bold text-sm transition-colors", isDarkMode ? "text-zinc-400 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900")}>AWS Bedrock Fallback</h4>
              <p className={cn("text-[10px] font-mono", isDarkMode ? "text-zinc-600" : "text-slate-600")}>Configure secondary inference unit</p>
            </div>
          </div>
          <Button variant="ghost" className={cn("h-8 border rounded-lg text-[9px] font-black uppercase", isDarkMode ? "border-zinc-800 text-zinc-500 hover:text-white" : "border-slate-300 text-slate-600 hover:text-slate-900")}>Configure</Button>
        </div>
      </div>
    </div>
  );
}
