"use client";

import { useState } from "react";

interface ReviseInputProps {
  onSubmit: (instruction: string) => void;
  isLoading?: boolean;
}

const SUGGESTED_CHIPS = [
  "Ajouter plus de details",
  "Simplifier les etapes",
  "Reordonner par priorite",
  "Ajouter des deadlines",
  "Fusionner les taches similaires",
];

export function ReviseInput({ onSubmit, isLoading = false }: ReviseInputProps) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = (text?: string) => {
    const value = text || instruction;
    if (value.trim().length < 10) return;
    onSubmit(value.trim());
    setInstruction("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUGGESTED_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSubmit(chip)}
            disabled={isLoading}
            className="whitespace-nowrap rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Decrivez votre revision..."
          disabled={isLoading}
          className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || instruction.trim().length < 10}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "..." : "Reviser"}
        </button>
      </div>
    </div>
  );
}
