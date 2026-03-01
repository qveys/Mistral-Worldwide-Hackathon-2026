'use client';

import React, { useState } from 'react';
import { Download, FileText, Clipboard, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  markdown: string;
  data: unknown;
  filename?: string;
  className?: string;
}

export function ExportButton({ markdown, data, filename = "roadmap", className }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
      >
        <Download size={18} />
        Exporter
        <ChevronDown size={16} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 z-50 origin-top-right"
            >
              <button
                onClick={handleCopyMarkdown}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Clipboard size={18} className="text-slate-400" />}
                Copier Markdown
              </button>
              
              <button
                onClick={handleDownloadMD}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <FileText size={18} className="text-slate-400" />
                Télécharger .md
              </button>
              
              <button
                onClick={handleDownloadJSON}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Download size={18} className="text-slate-400" />
                Télécharger .json
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
