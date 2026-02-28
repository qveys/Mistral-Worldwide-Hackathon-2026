import { Metadata } from 'next';
import { QuickStart } from '@/components/brain-dump/QuickStart';
import { Navbar } from '@/components/home/Navbar';
import { Hero } from '@/components/home/Hero';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';

export const metadata: Metadata = {
  title: 'EchoMaps | Chaos to Clarity',
  description: 'Transformez vos idées en roadmaps structurées grâce au Brain Dump Engine.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center max-w-5xl mx-auto space-y-12 relative z-10">
        
        <Hero />

        {/* --- BRAIN DUMP ENGINE --- */}
        <div className="w-full max-w-3xl">
          <QuickStart />
        </div>

        <FeaturesGrid />
      </main>

      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px] -z-0 pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px] -z-0 pointer-events-none" />
    </div>
  );
}
