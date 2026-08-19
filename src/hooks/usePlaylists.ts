import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as playlistsApi from '../api/playlists';
import { useAuthStore } from '../store/authStore';

export function useUserPlaylists(limit = 50) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['user-playlists', limit],
    queryFn: () => playlistsApi.getUserPlaylists(limit),
    enabled: isAuthenticated,
  });
}

export function usePlaylist(playlistId: string | undefined) {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => playlistsApi.getPlaylist(playlistId as string),
    enabled: Boolean(playlistId),
  });
}

export function usePlaylistTracks(playlistId: string | undefined, limit = 100) {
  return useQuery({
    queryKey: ['playlist-tracks', playlistId, limit],
    queryFn: () => playlistsApi.getPlaylistTracks(playlistId as string, limit),
    enabled: Boolean(playlistId),
  });
}

export function useCreatePlaylist(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description, isPublic }: { name: string; description?: string; isPublic?: boolean }) =>
      playlistsApi.createPlaylist(userId as string, name, { description, isPublic }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['user-playlists'] }),
  });
}

export function useRemoveTracksFromPlaylist(playlistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uris: string[]) => playlistsApi.removeTracksFromPlaylist(playlistId, uris),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['playlist-tracks', playlistId] });
      void queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    },
  });
}

export function useToggleFollowPlaylist() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['user-playlists'] });
    void queryClient.invalidateQueries({ queryKey: ['playlist-followed-status'] });
  };
  const follow = useMutation({
    mutationFn: ({ id }: { id: string; isPublic?: boolean }) => playlistsApi.followPlaylist(id),
    onSuccess: invalidate,
  });
  const unfollow = useMutation({
    mutationFn: (id: string) => playlistsApi.unfollowPlaylist(id),
    onSuccess: invalidate,
  });
  return { follow: follow.mutate, unfollow: unfollow.mutate };
}

/** Checks follow status for a set of playlist IDs — used to drive the follow button. */
export function usePlaylistFollowedStatus(playlistIds: string[]) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['playlist-followed-status', playlistIds],
    queryFn: () => playlistsApi.checkFollowingPlaylists(playlistIds),
    enabled: isAuthenticated && playlistIds.length > 0,
    staleTime: 60_000,
  });
}

export function useReorderPlaylistTracks(playlistId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rangeStart, insertBefore }: { rangeStart: number; insertBefore: number }) =>
      playlistsApi.reorderPlaylistTracks(playlistId, rangeStart, insertBefore),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['playlist-tracks', playlistId] }),
  });
}
