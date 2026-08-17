import { spotifyClient } from './client';
import type {
  FeaturedPlaylistsResponse,
  NewReleasesResponse,
  RecommendationsResponse,
  SearchResults,
  SearchType,
  SpotifyCategory,
  SpotifyTrack,
  SpotifyArtist ,
  Paginated,
} from '../types/spotify';

export async function search(
  query: string,
  types: SearchType[] = ['track', 'artist', 'album', 'playlist'],
  limit = 10
): Promise<SearchResults> {
  if (!query.trim()) return {};
  // Spotify's Feb 2026 API changes capped /search limit at 10 (was 50).
  const { data } = await spotifyClient.get<SearchResults>('/search', {
    params: { q: query, type: types.join(','), limit: Math.min(limit, 10) },
  });
  return data;
}

export async function getNewReleases(limit = 20): Promise<NewReleasesResponse> {
  const { data } = await spotifyClient.get<NewReleasesResponse>('/browse/new-releases', {
    params: { limit },
  });
  return data;
}

export async function getFeaturedPlaylists(limit = 20): Promise<FeaturedPlaylistsResponse> {
  const { data } = await spotifyClient.get<FeaturedPlaylistsResponse>(
    '/browse/featured-playlists',
    { params: { limit } }
  );
  return data;
}

export async function getCategories(limit = 30): Promise<Paginated<SpotifyCategory>> {
  const { data } = await spotifyClient.get<{ categories: Paginated<SpotifyCategory> }>(
    '/browse/categories',
    { params: { limit } }
  );
  return data.categories;
}

interface RecommendationParams {
  seedTracks?: string[];
  seedArtists?: string[];
  seedGenres?: string[];
  limit?: number;
  targetEnergy?: number;
  targetValence?: number;
  targetDanceability?: number;
}

export async function getRecommendations(
  params: RecommendationParams
): Promise<RecommendationsResponse> {
  const { data } = await spotifyClient.get<RecommendationsResponse>('/recommendations', {
    params: {
      seed_tracks: params.seedTracks?.join(','),
      seed_artists: params.seedArtists?.join(','),
      seed_genres: params.seedGenres?.join(','),
      limit: params.limit ?? 20,
      target_energy: params.targetEnergy,
      target_valence: params.targetValence,
      target_danceability: params.targetDanceability,
    },
  });
  return data;
}

export async function getAvailableGenreSeeds(): Promise<string[]> {
  const { data } = await spotifyClient.get<{ genres: string[] }>(
    '/recommendations/available-genre-seeds'
  );
  return data.genres;
}
// Stable replacements for the deprecated /browse and /recommendations
// endpoints. Spotify retired /browse/featured-playlists, /browse/new-releases,
// /browse/categories, and /recommendations for most developer apps — these
// personal-data endpoints remain fully supported.

export type TopTimeRange = 'short_term' | 'medium_term' | 'long_term';

interface RecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

export async function getRecentlyPlayed(limit = 20): Promise<RecentlyPlayedItem[]> {
  const { data } = await spotifyClient.get<{ items: RecentlyPlayedItem[] }>(
    '/me/player/recently-played',
    { params: { limit } }
  );
  return data.items;
}

export async function getTopTracks(
  timeRange: TopTimeRange = 'medium_term',
  limit = 20
): Promise<SpotifyTrack[]> {
  const { data } = await spotifyClient.get<Paginated<SpotifyTrack>>('/me/top/tracks', {
    params: { time_range: timeRange, limit },
  });
  return data.items;
}

export async function getTopArtists(
  timeRange: TopTimeRange = 'medium_term',
  limit = 20
): Promise<SpotifyArtist[]> {
  const { data } = await spotifyClient.get<Paginated<SpotifyArtist>>('/me/top/artists', {
    params: { time_range: timeRange, limit },
  });
  return data.items;
}