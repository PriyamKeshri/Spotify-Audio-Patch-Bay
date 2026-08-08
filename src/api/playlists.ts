import { spotifyClient } from './client';
import type { Paginated, SpotifyPlaylist, SpotifyPlaylistTrack, SpotifyUser } from '../types/spotify';

// Rebuilt against Spotify's February 2026 Web API changes:
// - GET/POST/PUT/DELETE /playlists/{id}/tracks -> .../items
// - POST /users/{id}/playlists -> POST /me/playlists
// - PUT/DELETE /playlists/{id}/followers -> unified PUT/DELETE /me/library
// See https://developer.spotify.com/documentation/web-api/references/changes/february-2026

export async function getCurrentUser(): Promise<SpotifyUser> {
  const { data } = await spotifyClient.get<SpotifyUser>('/me');
  return data;
}

export async function getUserPlaylists(limit = 20, offset = 0): Promise<Paginated<SpotifyPlaylist>> {
  const { data } = await spotifyClient.get<Paginated<SpotifyPlaylist>>('/me/playlists', {
    params: { limit, offset },
  });
  return data;
}

export async function getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
  const { data } = await spotifyClient.get<SpotifyPlaylist>(`/playlists/${playlistId}`);
  return data;
}

export async function getPlaylistTracks(
  playlistId: string,
  limit = 50,
  offset = 0
): Promise<Paginated<SpotifyPlaylistTrack>> {
  const { data } = await spotifyClient.get<Paginated<SpotifyPlaylistTrack>>(
    `/playlists/${playlistId}/items`,
    { params: { limit, offset } }
  );
  return data;
}

export async function createPlaylist(
  _userId: string,
  name: string,
  options: { description?: string; isPublic?: boolean } = {}
): Promise<SpotifyPlaylist> {
  const { data } = await spotifyClient.post<SpotifyPlaylist>('/me/playlists', {
    name,
    description: options.description ?? '',
    public: options.isPublic ?? false,
  });
  return data;
}

export async function updatePlaylistDetails(
  playlistId: string,
  updates: { name?: string; description?: string; isPublic?: boolean }
): Promise<void> {
  await spotifyClient.put(`/playlists/${playlistId}`, {
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.description !== undefined ? { description: updates.description } : {}),
    ...(updates.isPublic !== undefined ? { public: updates.isPublic } : {}),
  });
}

export async function addTracksToPlaylist(playlistId: string, uris: string[]): Promise<void> {
  await spotifyClient.post(`/playlists/${playlistId}/items`, { uris });
}

export async function removeTracksFromPlaylist(playlistId: string, uris: string[]): Promise<void> {
  await spotifyClient.delete(`/playlists/${playlistId}/items`, {
    data: { tracks: uris.map((uri) => ({ uri })) },
  });
}

export async function reorderPlaylistTracks(
  playlistId: string,
  rangeStart: number,
  insertBefore: number,
  rangeLength = 1
): Promise<void> {
  await spotifyClient.put(`/playlists/${playlistId}/items`, {
    range_start: rangeStart,
    insert_before: insertBefore,
    range_length: rangeLength,
  });
}

export async function followPlaylist(playlistId: string): Promise<void> {
  await spotifyClient.put('/me/library', { uris: [`spotify:playlist:${playlistId}`] });
}

export async function unfollowPlaylist(playlistId: string): Promise<void> {
  await spotifyClient.delete('/me/library', { data: { uris: [`spotify:playlist:${playlistId}`] } });
}
