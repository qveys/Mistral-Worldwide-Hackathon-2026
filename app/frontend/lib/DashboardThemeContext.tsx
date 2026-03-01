'use client';

/**
 * Re-exports global theme for dashboard. ThemeProvider is mounted in root layout.
 * useDashboardTheme is kept for backward compatibility with existing dashboard components.
 */
export { useTheme as useDashboardTheme } from '@/lib/ThemeContext';
