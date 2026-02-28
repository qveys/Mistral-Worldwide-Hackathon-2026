"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function AccessibleButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: AccessibleButtonProps) {
  const baseClasses = "rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50";

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "border border-border bg-secondary text-foreground hover:bg-secondary/80",
    ghost: "text-foreground hover:bg-secondary",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
