'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface DashboardThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null);

export function DashboardThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <DashboardThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) {
    throw new Error('useDashboardTheme must be used within DashboardThemeProvider');
  }
  return ctx;
}
