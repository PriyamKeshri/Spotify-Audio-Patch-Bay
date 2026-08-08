// Core Spotify Web API type definitions.
// Only the fields the app actually consumes are modeled — not the full API surface.

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email?: string;
  images: SpotifyImage[];
  followers?: { total: number };
  product?: 'premium' | 'free' | 'open';
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
  followers?: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  album_type: 'album' | 'single' | 'compilation';
  artists: SpotifyArtist[];
  total_tracks: number;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  explicit: boolean;
  popularity?: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyPlaylistTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  owner: { id: string; display_name: string | null };
  public: boolean | null;
  collaborative: boolean;
  items?: { total: number; href: string };
  external_urls: { spotify: string };
  snapshot_id: string;
}

export interface SpotifyDevice {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: 'Computer' | 'Smartphone' | 'Speaker' | 'TV' | 'Unknown' | string;
  volume_percent: number | null;
  supports_volume: boolean;
}

export type RepeatState = 'off' | 'track' | 'context';

export interface SpotifyPlaybackState {
  device: SpotifyDevice;
  repeat_state: RepeatState;
  shuffle_state: boolean;
  context: {
    type: string;
    href: string;
    external_urls: { spotify: string };
    uri: string;
  } | null;
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: SpotifyTrack | null;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  actions: {
    disallows: Partial<Record<
      | 'interrupting_playback'
      | 'pausing'
      | 'resuming'
      | 'seeking'
      | 'skipping_next'
      | 'skipping_prev'
      | 'toggling_repeat_context'
      | 'toggling_shuffle'
      | 'toggling_repeat_track'
      | 'transferring_playback',
      boolean
    >>;
  };
}

export interface SpotifyQueue {
  currently_playing: SpotifyTrack | null;
  queue: SpotifyTrack[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SearchResults {
  tracks?: Paginated<SpotifyTrack>;
  artists?: Paginated<SpotifyArtist>;
  albums?: Paginated<SpotifyAlbum>;
  playlists?: Paginated<SpotifyPlaylist>;
}

export type SearchType = 'track' | 'artist' | 'album' | 'playlist';

export interface FeaturedPlaylistsResponse {
  message: string;
  playlists: Paginated<SpotifyPlaylist>;
}

export interface NewReleasesResponse {
  albums: Paginated<SpotifyAlbum>;
}

export interface SpotifyCategory {
  id: string;
  name: string;
  icons: SpotifyImage[];
}

export interface RecommendationSeed {
  id: string;
  type: 'artist' | 'track' | 'genre';
}

export interface RecommendationsResponse {
  seeds: RecommendationSeed[];
  tracks: SpotifyTrack[];
}

export interface SavedTrackEntry {
  added_at: string;
  track: SpotifyTrack;
}

export interface SavedAlbumEntry {
  added_at: string;
  album: SpotifyAlbum;
}

// --- Auth ---

export interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface StoredToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
  scope: string;
}

// --- App-level errors ---

export interface SpotifyApiErrorShape {
  error: {
    status: number;
    message: string;
  };
}
