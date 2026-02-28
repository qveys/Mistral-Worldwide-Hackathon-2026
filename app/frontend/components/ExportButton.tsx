"use client";

import { useState, useRef, useEffect } from "react";
import { roadmapToMarkdown, downloadJSON, copyToClipboard } from "@/lib/exportUtils";
import type { RoadmapItem } from "@/lib/exportUtils";

interface ExportButtonProps {
  roadmap: RoadmapItem[];
  projectId?: string;
  projectName?: string;
}

export function ExportButton({ roadmap, projectId, projectName }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleCopyMarkdown = async () => {
    const md = roadmapToMarkdown(roadmap, projectName);
    const success = await copyToClipboard(md);
    setToast(success ? "Copied!" : "Copy failed");
    setIsOpen(false);
  };

  const handleDownloadJSON = () => {
    const filename = `echomaps-${projectId || "export"}.json`;
    downloadJSON({ roadmap, exportedAt: new Date().toISOString() }, filename);
    setToast("Downloaded!");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Export roadmap"
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Exporter
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50">
          <button
            onClick={handleCopyMarkdown}
            className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors rounded-t-lg"
          >
            Copier Markdown
          </button>
          <button
            onClick={handleDownloadJSON}
            className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-secondary transition-colors rounded-b-lg"
          >
            Telecharger JSON
          </button>
        </div>
      )}

      {toast && (
        <div className="absolute right-0 top-full mt-12 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
