export const API_URL =
  process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4000';

export const AUTH_TOKEN_KEY = 'echomaps_token';

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
