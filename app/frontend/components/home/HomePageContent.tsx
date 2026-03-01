'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Navbar } from '@/components/home/Navbar';
import { LoginForm } from '@/components/ui/LoginForm';
import { useAuth } from '@/lib/AuthContext';
import type { LoginCredentials } from '@/components/ui/LoginForm';

export function HomePageContent() {
  const router = useRouter();
  const { isLoggedIn, loginWithEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleLoginSubmit = async (credentials: LoginCredentials) => {
    if (isSubmitting || !credentials.email.trim()) return;
    setIsSubmitting(true);
    await loginWithEmail(credentials.email);
    setIsSubmitting(false);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#09090b] text-slate-900 dark:text-zinc-400 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-violet-500/30 dark:selection:text-zinc-100 overflow-x-hidden transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full flex justify-center items-center">
          <LoginForm onSubmit={handleLoginSubmit} isLoading={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
