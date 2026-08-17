import type { StoredToken, TokenResponse } from '../types/spotify';
import { TOKEN_STORAGE_KEY } from './config';

// Refresh a bit early so a request that starts right before expiry doesn't
// race the clock and fail mid-flight.
const EXPIRY_SAFETY_MARGIN_MS = 60_000;

export function persistToken(response: TokenResponse, previousRefreshToken?: string): StoredToken {
  const token: StoredToken = {
    accessToken: response.access_token,
    // Spotify doesn't always return a new refresh_token on refresh — reuse the old one.
    refreshToken: response.refresh_token ?? previousRefreshToken ?? '',
    expiresAt: Date.now() + response.expires_in * 1000,
    scope: response.scope,
  };
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
  return token;
}

export function readStoredToken(): StoredToken | null {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredToken;
  } catch {
    return null;
  }
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isTokenExpired(token: StoredToken): boolean {
  return Date.now() + EXPIRY_SAFETY_MARGIN_MS >= token.expiresAt;
}
