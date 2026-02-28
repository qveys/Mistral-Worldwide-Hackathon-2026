'use client';

import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter italic">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-[#ff4f00] rounded-sm rotate-45" />
        </div>
        ECHOMAPS
      </Link>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/dashboard" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">Dashboard</Link>
        <Link href="/documentation?category=methodology" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">Methodology</Link>
        <Link href="/documentation" className="px-4 py-2 rounded-full bg-orange-50 text-[#ff4f00] font-bold border border-orange-100 hover:bg-orange-100 transition-all duration-300">Documentation</Link>
        <Link href="/documentation?category=api" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">API</Link>
        <div className="h-4 w-[1px] bg-slate-200 mx-2" />
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full hover:bg-slate-100 hover:text-black transition-all duration-300">GitHub</a>
      </div>
    </nav>
  );
}
