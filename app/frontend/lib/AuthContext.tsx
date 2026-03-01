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
    // Start false to match SSR, then hydrate from localStorage after mount
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem(AUTH_TOKEN_KEY));
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
            const trimmed = email.trim();

            const attemptLogin = async (): Promise<
                { ok: true } | { ok: false; error: string; status: number }
            > => {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: trimmed }),
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
                return {
                    ok: false,
                    error: data.error ?? data.code ?? 'unknown_error',
                    status: res.status,
                };
            };

            try {
                const first = await attemptLogin();
                if (first.ok) return { ok: true };

                // If user doesn't exist (401), auto-register then retry login
                if (!first.ok && first.status === 401) {
                    const regRes = await fetch(`${API_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: trimmed }),
                    });
                    if (!regRes.ok) {
                        const regData = (await regRes.json().catch(() => ({}))) as {
                            error?: string;
                        };
                        return { ok: false, error: regData.error ?? 'registration_failed' };
                    }
                    const retry = await attemptLogin();
                    if (retry.ok) return { ok: true };
                    return { ok: false, error: 'status' in retry ? retry.error : 'unknown_error' };
                }

                return { ok: false, error: first.error };
            } catch {
                return { ok: false, error: 'network_error' };
            }
        },
        [login],
    );
    const value: AuthContextValue = { isLoggedIn, login, logout, loginWithEmail };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
