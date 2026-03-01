'use client';

import { QuickStart } from '@/components/brain-dump/QuickStart';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';
import { Hero } from '@/components/home/Hero';
import { Navbar } from '@/components/home/Navbar';

export function HomePageContent() {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] text-slate-900 dark:text-zinc-400 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-500/30 dark:selection:text-zinc-100 overflow-x-hidden transition-colors duration-300">
            <Navbar />
            <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-20 gap-16 md:gap-24">
                <section className="flex flex-col items-center text-center space-y-6">
                    <Hero />
                </section>
                <section className="w-full max-w-2xl">
                    <QuickStart />
                </section>
                <section className="w-full pt-8 border-t border-slate-200 dark:border-zinc-800">
                    <FeaturesGrid />
                </section>
            </main>
        </div>
    );
}
