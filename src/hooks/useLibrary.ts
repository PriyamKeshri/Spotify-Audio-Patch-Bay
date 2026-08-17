import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as libraryApi from '../api/library';
import { useAuthStore } from '../store/authStore';

export function useSavedTracks(limit = 50) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['saved-tracks', limit],
    queryFn: () => libraryApi.getSavedTracks(limit),
    enabled: isAuthenticated,
  });
}

export function useSavedAlbums(limit = 50) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['saved-albums', limit],
    queryFn: () => libraryApi.getSavedAlbums(limit),
    enabled: isAuthenticated,
  });
}

export function useFollowedArtists(limit = 50) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['followed-artists', limit],
    queryFn: () => libraryApi.getFollowedArtists(limit),
    enabled: isAuthenticated,
  });
}

/** Checks saved status for a set of track IDs — used to drive heart/save icons. */
export function useTrackSavedStatus(trackIds: string[]) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['saved-status', trackIds],
    queryFn: () => libraryApi.checkSavedTracks(trackIds),
    enabled: isAuthenticated && trackIds.length > 0,
    staleTime: 60_000,
  });
}

export function useToggleSavedTrack() {
  const queryClient = useQueryClient();

  const save = useMutation({
    mutationFn: (id: string) => libraryApi.saveTracks([id]),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['saved-tracks'] });
      void queryClient.invalidateQueries({ queryKey: ['saved-status'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => libraryApi.removeSavedTracks([id]),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['saved-tracks'] });
      void queryClient.invalidateQueries({ queryKey: ['saved-status'] });
    },
  });

  return { save: save.mutate, remove: remove.mutate };
}

export function useToggleFollowArtist() {
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: (id: string) => libraryApi.followArtists([id]),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['followed-artists'] }),
  });

  const unfollow = useMutation({
    mutationFn: (id: string) => libraryApi.unfollowArtists([id]),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['followed-artists'] }),
  });

  return { follow: follow.mutate, unfollow: unfollow.mutate };
}
