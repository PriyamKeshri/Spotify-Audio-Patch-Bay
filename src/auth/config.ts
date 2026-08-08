// Spotify OAuth endpoints and app-wide scope configuration.
// The client ID comes from a Spotify Developer Dashboard app — no client secret
// is ever used or needed, which is the entire point of the PKCE flow.

export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? '';
export const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI ?? `${window.location.origin}/callback`;

// Scopes are grouped by feature area so it's obvious what each one unlocks.
// Request only what the app uses — Spotify shows every scope to the user on consent.
export const SCOPES = [
  // Playback control (Spotify Connect) — requires Premium on the account side.
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  // Playback history / recently played
  'user-read-recently-played',
  'user-read-playback-position',
  // Library management
  'user-library-read',
  'user-library-modify',
  // Playlists
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  // Follow
  'user-follow-read',
  'user-follow-modify',
  // Profile
  'user-read-email',
  'user-read-private',
  // Top items, used for recommendation seeding
  'user-top-read',
].join(' ');

export const TOKEN_STORAGE_KEY = 'spotify_client_tokens';
export const PKCE_VERIFIER_STORAGE_KEY = 'spotify_pkce_verifier';
export const OAUTH_STATE_STORAGE_KEY = 'spotify_oauth_state';
