'use client';

import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="pt-12 pb-8 px-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter italic">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45 opacity-90" />
        </div>
        ECHOMAPS
      </Link>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/dashboard" className="px-4 py-2 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all duration-300">Dashboard</Link>
        <Link href="/documentation" className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold border-2 border-slate-300 hover:bg-blue-100 hover:border-blue-200 transition-all duration-300">Documentation</Link>
        <div className="h-4 w-[1px] bg-slate-300 mx-2" />
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all duration-300">
          <Github size={20} />
        </a>
      </div>
    </nav>
  );
}
