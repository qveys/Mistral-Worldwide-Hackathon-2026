'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { useAuth } from '@/lib/AuthContext';

export function HomePageContent() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] text-slate-900 dark:text-zinc-400 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-violet-500/30 dark:selection:text-zinc-100 overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <Hero />
        <FeaturesGrid />
      </main>
    </div>
  );
}
