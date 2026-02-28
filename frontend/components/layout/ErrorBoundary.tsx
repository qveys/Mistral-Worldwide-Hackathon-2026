'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-red-200/50 dark:border-red-900/20 shadow-2xl space-y-6">
          <div className="h-20 w-20 rounded-3xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertOctagon size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">
              Oups ! Quelque chose s&apos;est mal passé.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
              Une erreur inattendue est survenue lors de la génération. Ne vous inquiétez pas, vos idées sont en sécurité.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              <RefreshCcw size={18} />
              Réessayer
            </button>
            
            <a
              href="/"
              className="flex items-center gap-2 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white transition-all"
            >
              <Home size={18} />
              Retour
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
