'use client';

import { Link } from '@/i18n/navigation';
import { AlertTriangle, Command, Ghost, Home, MoveLeft, ShieldAlert, Terminal } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';

interface ErrorLayoutProps {
    code: string;
    title: string;
    message: string;
    icon?: '404' | '500' | '401' | '405';
    labels?: {
        back?: string;
        returnHome?: string;
        systemInterrupt?: string;
    };
}

const icons = {
    '404': Ghost,
    '500': AlertTriangle,
    '401': ShieldAlert,
    '405': Terminal,
};

export function ErrorLayout({ code, title, message, icon, labels }: ErrorLayoutProps) {
    const back = labels?.back ?? 'Back';
    const returnHome = labels?.returnHome ?? 'Return Home';
    const systemInterrupt = labels?.systemInterrupt ?? `SYSTEM_INTERRUPT #${code}`;
    const Icon = icon ? icons[icon] : AlertTriangle;
    const [traceId] = useState(() => Math.random().toString(36).substring(7));
    const [timestamp] = useState(() => new Date().toISOString());

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center select-none">
                <span className="text-[30rem] font-black italic tracking-tighter">{code}</span>
            </div>

            <div className="max-w-md w-full space-y-12 relative z-10 text-center">
                {/* Animated Icon */}
                <div className="flex justify-center">
                    <div className="h-24 w-24 bg-zinc-900 border border-zinc-800 rounded-[2rem] flex items-center justify-center text-violet-500 shadow-2xl shadow-violet-500/10 animate-pulse">
                        <Icon size={48} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <Command size={12} />
                        {systemInterrupt}
                    </div>
                    <h1 className="text-4xl font-medium tracking-tight text-white leading-tight">
                        {title}
                    </h1>
                    <p className="text-zinc-500 font-medium leading-relaxed italic">
                        &quot;{message}&quot;
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={() => window.history.back()}
                        variant="ghost"
                        className="w-full sm:w-auto h-12 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    >
                        <MoveLeft size={14} className="mr-2" /> {back}
                    </Button>
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl px-8 text-[10px] font-bold uppercase tracking-widest shadow-xl">
                            <Home size={14} className="mr-2" /> {returnHome}
                        </Button>
                    </Link>
                </div>

                {/* Terminal Log Simulation */}
                <div className="pt-12 border-t border-zinc-800/50">
                    <div className="font-mono text-[9px] text-zinc-700 space-y-1.5 flex flex-col items-center">
                        <p>{`> TRACE_ID: echomaps-${traceId}`}</p>
                        <p>{`> TIMESTAMP: ${timestamp}`}</p>
                        <p className="text-violet-900">{`> connection_sync_terminated`}</p>
                    </div>
                </div>
            </div>

            {/* Subtle Grain Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
