import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { SPOTIFY_API_BASE } from '../auth/config';
import { isTokenExpired, readStoredToken } from '../auth/tokenStore';
import { AuthError, refreshAccessToken } from '../auth/authFlow';
import type { SpotifyApiErrorShape } from '../types/spotify';
import { publishDebugLog } from '../components/layout/DebugPanel';

export class SpotifyApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'SpotifyApiError';
    this.status = status;
    this.details = details;
  }
}

export const spotifyClient = axios.create({
  baseURL: SPOTIFY_API_BASE,
});

// De-dupes concurrent refresh attempts: if five requests 401 at once, we
// refresh exactly once and let the others wait on the same promise.
let refreshInFlight: Promise<string> | null = null;

async function getValidAccessToken(): Promise<string> {
  const token = readStoredToken();
  if (!token) throw new AuthError('Not authenticated.');

  if (!isTokenExpired(token)) return token.accessToken;

  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken()
      .then((t) => t.accessToken)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

spotifyClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const accessToken = await getValidAccessToken();
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

spotifyClient.interceptors.response.use(
  (response) => {
    publishDebugLog({
      method: (response.config.method ?? 'get').toUpperCase(),
      url: String(response.config.url),
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError<SpotifyApiErrorShape>) => {
    const { config, response } = error;
    publishDebugLog({
      method: (config?.method ?? 'get').toUpperCase(),
      url: String(config?.url),
      status: response?.status,
    });

    // One retry after a forced refresh, in case the interceptor's cached
    // token was stale (e.g. clock skew, or refreshed in another tab).
    if (response?.status === 401 && config && !(config as { _retried?: boolean })._retried) {
      (config as { _retried?: boolean })._retried = true;
      try {
        const fresh = await refreshAccessToken();
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${fresh.accessToken}`;
        return spotifyClient.request(config);
      } catch {
        throw new AuthError('Session expired. Please sign in again.');
      }
    }

    if (response?.status === 429) {
      const retryAfter = Number(response.headers['retry-after'] ?? '1');
      throw new SpotifyApiError(
        `Rate limited by Spotify. Retry after ${retryAfter}s.`,
        429,
        { retryAfter }
      );
    }

    const message = response?.data?.error?.message ?? error.message ?? 'Unknown Spotify API error';
    throw new SpotifyApiError(message, response?.status ?? 0, response?.data);
  }
);
