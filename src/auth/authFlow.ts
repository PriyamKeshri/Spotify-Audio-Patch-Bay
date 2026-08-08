import {
  CLIENT_ID,
  OAUTH_STATE_STORAGE_KEY,
  PKCE_VERIFIER_STORAGE_KEY,
  REDIRECT_URI,
  SCOPES,
  SPOTIFY_AUTHORIZE_URL,
  SPOTIFY_TOKEN_URL,
} from './config';
import { generateCodeChallenge, generateCodeVerifier, generateState } from './pkce';
import { clearStoredToken, persistToken, readStoredToken } from './tokenStore';
import type { StoredToken, TokenResponse } from '../types/spotify';

export class AuthError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AuthError';
    this.cause = cause;
  }
}

/**
 * Kicks off the PKCE flow: generates verifier + challenge + state, stashes the
 * verifier and state in sessionStorage (survives the redirect, cleared on tab close),
 * then redirects the browser to Spotify's authorize screen.
 */
export async function beginAuthorization(): Promise<void> {
  if (!CLIENT_ID) {
    throw new AuthError(
      'Missing VITE_SPOTIFY_CLIENT_ID. Add your Spotify app client ID to .env — see README.'
    );
  }

  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateState();

  sessionStorage.setItem(PKCE_VERIFIER_STORAGE_KEY, verifier);
  sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    scope: SCOPES,
  });

  window.location.assign(`${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`);
}

/**
 * Completes the flow on the /callback page: validates `state`, exchanges the
 * authorization `code` + stored `verifier` for tokens, and persists them.
 */
export async function completeAuthorization(searchParams: URLSearchParams): Promise<StoredToken> {
  const error = searchParams.get('error');
  if (error) {
    throw new AuthError(`Spotify authorization was denied: ${error}`);
  }

  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');
  const expectedState = sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);
  const verifier = sessionStorage.getItem(PKCE_VERIFIER_STORAGE_KEY);

  if (!code) throw new AuthError('No authorization code was returned by Spotify.');
  if (!expectedState || returnedState !== expectedState) {
    throw new AuthError('State mismatch — possible CSRF. Please try signing in again.');
  }
  if (!verifier) {
    throw new AuthError('Missing PKCE verifier — the auth session may have expired. Try again.');
  }

  sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);
  sessionStorage.removeItem(PKCE_VERIFIER_STORAGE_KEY);

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const detail = await safeErrorDetail(res);
    throw new AuthError(`Token exchange failed (${res.status}): ${detail}`);
  }

  const json = (await res.json()) as TokenResponse;
  return persistToken(json);
}

/** Exchanges a refresh_token for a new access_token. Throws AuthError on failure. */
export async function refreshAccessToken(): Promise<StoredToken> {
  const existing = readStoredToken();
  if (!existing?.refreshToken) {
    throw new AuthError('No refresh token available — user must re-authenticate.');
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: existing.refreshToken,
  });

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const detail = await safeErrorDetail(res);
    clearStoredToken();
    throw new AuthError(`Token refresh failed (${res.status}): ${detail}`);
  }

  const json = (await res.json()) as TokenResponse;
  return persistToken(json, existing.refreshToken);
}

export function logout(): void {
  clearStoredToken();
}

async function safeErrorDetail(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error_description ?? data.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
