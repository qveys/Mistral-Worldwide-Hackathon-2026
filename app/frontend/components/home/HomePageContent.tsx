'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { QuickStart } from '@/components/brain-dump/QuickStart';
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
    <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] text-slate-900 dark:text-zinc-400 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-500/30 dark:selection:text-zinc-100 overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20 gap-10 sm:gap-16 md:gap-24">
        <section className="flex flex-col items-center text-center space-y-4 sm:space-y-6 w-full">
          <Hero />
        </section>
        <section className="w-full max-w-2xl px-0 sm:px-2">
          <QuickStart />
        </section>
        <section className="w-full pt-6 sm:pt-8 border-t border-slate-200 dark:border-zinc-800">
          <FeaturesGrid />
        </section>
      </main>
    </div>
  );
}
