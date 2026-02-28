"use client";

import { useState, useEffect } from "react";

interface Template {
  slug: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

interface TemplateSelectorProps {
  onSelect: (slug: string | null) => void;
}

const ICON_MAP: Record<string, string> = {
  "graduation-cap": "\uD83C\uDF93",
  "briefcase": "\uD83D\uDCBC",
  "rocket": "\uD83D\uDE80",
};

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${apiUrl}/api/templates`)
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {templates.map((template) => (
        <button
          key={template.slug}
          onClick={() => onSelect(template.slug)}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
        >
          <span className="text-3xl">{ICON_MAP[template.icon] || "\uD83D\uDCCB"}</span>
          <h3 className="text-lg font-semibold text-card-foreground">{template.title}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
          <div className="flex flex-wrap gap-1 mt-auto">
            {template.examples.map((ex) => (
              <span
                key={ex}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {ex}
              </span>
            ))}
          </div>
        </button>
      ))}

      <button
        onClick={() => onSelect(null)}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 p-6 text-center transition-all hover:border-primary hover:bg-card"
      >
        <span className="text-3xl">{"\u2728"}</span>
        <h3 className="text-lg font-semibold text-card-foreground">Partir de zero</h3>
        <p className="text-sm text-muted-foreground">Commencez avec un brain dump libre</p>
      </button>
    </div>
  );
}
