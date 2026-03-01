'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_URL, AUTH_TOKEN_KEY } from './api';

type AuthContextValue = {
  isLoggedIn: boolean;
  /** Store token after successful login (called internally by loginWithEmail). */
  login: (token: string) => void;
  logout: () => void;
  /** Call POST /auth/login with email; on success stores token and returns ok. */
  loginWithEmail: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const has = typeof window !== 'undefined' && !!localStorage.getItem(AUTH_TOKEN_KEY);
    setIsLoggedIn(has);
  }, []);

  const login = useCallback((token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsLoggedIn(false);
    }
  }, []);

  const loginWithEmail = useCallback(
    async (email: string): Promise<{ ok: true } | { ok: false; error: string }> => {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          error?: string;
          code?: string;
          token?: string;
        };
        if (res.ok && data.success && typeof data.token === 'string') {
          login(data.token);
          return { ok: true };
        }
        if (res.ok && data.success) {
          return { ok: false, error: 'server_error' };
        }

        if (data.error || data.code) {
          return { ok: false, error: data.error ?? data.code ?? 'unknown_error' };
        }

        if (res.status === 400) {
          return { ok: false, error: 'invalid_email' };
        }
        if (res.status === 401) {
          return { ok: false, error: 'unauthorized' };
        }
        if (res.status >= 500) {
          return { ok: false, error: 'server_error' };
        }

        return { ok: false, error: 'unknown_error' };
      } catch {
        return { ok: false, error: 'network_error' };
      }
    },
    [login]
  );
  const value: AuthContextValue = { isLoggedIn, login, logout, loginWithEmail };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
