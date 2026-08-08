import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as discoveryApi from '../api/discovery';
import { useAuthStore } from '../store/authStore';
import { debounce } from '../lib/utils';
import type { SearchType } from '../types/spotify';

export type { TopTimeRange } from '../api/discovery';

const SEARCH_DEBOUNCE_MS = 350;

export function useSearch(types: SearchType[] = ['track', 'artist', 'album', 'playlist']) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [rawInput, setRawInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const debouncedSetter = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), SEARCH_DEBOUNCE_MS),
    []
  );

  const setQuery = (value: string) => {
    setRawInput(value);
    debouncedSetter(value);
  };

  const query = useQuery({
    queryKey: ['search', debouncedQuery, types],
    queryFn: () => discoveryApi.search(debouncedQuery, types),
    enabled: isAuthenticated && debouncedQuery.trim().length > 0,
    staleTime: 30_000,
  });

  return {
    inputValue: rawInput,
    setQuery,
    results: query.data,
    isSearching: query.isFetching,
    hasQuery: debouncedQuery.trim().length > 0,
  };
}

export function useFeaturedPlaylists() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['featured-playlists'],
    queryFn: () => discoveryApi.getFeaturedPlaylists(24),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}

export function useNewReleases() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['new-releases'],
    queryFn: () => discoveryApi.getNewReleases(24),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => discoveryApi.getCategories(30),
    enabled: isAuthenticated,
    staleTime: 30 * 60 * 1000,
  });
}

export function useRecommendations(seedGenres: string[], enabled: boolean) {
  return useQuery({
    queryKey: ['recommendations', seedGenres],
    queryFn: () => discoveryApi.getRecommendations({ seedGenres, limit: 20 }),
    enabled: enabled && seedGenres.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenreSeeds() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['genre-seeds'],
    queryFn: discoveryApi.getAvailableGenreSeeds,
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
}

export function useRecentlyPlayed(limit = 20) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['recently-played', limit],
    queryFn: () => discoveryApi.getRecentlyPlayed(limit),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useTopTracks(timeRange: discoveryApi.TopTimeRange = 'medium_term', limit = 20) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['top-tracks', timeRange, limit],
    queryFn: () => discoveryApi.getTopTracks(timeRange, limit),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTopArtists(timeRange: discoveryApi.TopTimeRange = 'medium_term', limit = 20) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['top-artists', timeRange, limit],
    queryFn: () => discoveryApi.getTopArtists(timeRange, limit),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });
}