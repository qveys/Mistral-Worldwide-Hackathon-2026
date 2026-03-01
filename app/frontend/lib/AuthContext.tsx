'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const SESSION_KEY = 'echomaps_session';

type AuthContextValue = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsLoggedIn(!!window.localStorage.getItem(SESSION_KEY));
  }, []);

  const login = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SESSION_KEY, '1');
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
