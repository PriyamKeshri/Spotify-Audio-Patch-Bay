import { spotifyClient } from './client';
import type { Paginated, SavedAlbumEntry, SavedTrackEntry, SpotifyArtist } from '../types/spotify';

// Reads (GET /me/tracks, /me/albums, /me/following) remain on their original
// endpoints per Spotify's Feb 2026 changes. Writes (save/remove/follow/unfollow)
// and existence checks were unified onto PUT/DELETE/GET /me/library, keyed by
// Spotify URI rather than bare ID.
// See https://developer.spotify.com/documentation/web-api/references/changes/february-2026
//
// PUT/DELETE /me/library both take `uris` as a query param, not a JSON body
// (matching GET .../contains) — sending it as a body 400s with "Missing
// required field: uris", confirmed against the live API.

export async function getSavedTracks(limit = 20, offset = 0): Promise<Paginated<SavedTrackEntry>> {
  const { data } = await spotifyClient.get<Paginated<SavedTrackEntry>>('/me/tracks', {
    params: { limit, offset },
  });
  return data;
}

export async function saveTracks(ids: string[]): Promise<void> {
  await spotifyClient.put('/me/library', null, {
    params: { uris: ids.map((id) => `spotify:track:${id}`).join(',') },
  });
}

export async function removeSavedTracks(ids: string[]): Promise<void> {
  await spotifyClient.delete('/me/library', {
    params: { uris: ids.map((id) => `spotify:track:${id}`).join(',') },
  });
}

export async function checkSavedTracks(ids: string[]): Promise<boolean[]> {
  if (ids.length === 0) return [];
  const { data } = await spotifyClient.get<boolean[]>('/me/library/contains', {
    params: { uris: ids.map((id) => `spotify:track:${id}`).join(',') },
  });
  return data;
}

export async function getSavedAlbums(limit = 20, offset = 0): Promise<Paginated<SavedAlbumEntry>> {
  const { data } = await spotifyClient.get<Paginated<SavedAlbumEntry>>('/me/albums', {
    params: { limit, offset },
  });
  return data;
}

export async function getFollowedArtists(limit = 20, after?: string): Promise<{
  artists: Paginated<SpotifyArtist> & { cursors: { after: string | null } };
}> {
  const { data } = await spotifyClient.get('/me/following', {
    params: { type: 'artist', limit, after },
  });
  return data;
}
