import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as playbackApi from '../api/playback';
import { usePlayerStore } from '../store/playerStore';
import { useAuthStore } from '../store/authStore';
import type { RepeatState } from '../types/spotify';

const POLL_INTERVAL_MS = 3000;
const LOCAL_TICK_MS = 250;

/**
 * Polls GET /me/player on an interval and mirrors the result into the player
 * store. Also runs a fast local ticker so the progress bar advances smoothly
 * between polls instead of visibly jumping every 3 seconds.
 */
export function usePlaybackSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setPlayback = usePlayerStore((s) => s.setPlayback);
  const setIsPolling = usePlayerStore((s) => s.setIsPolling);
  const tickLocalProgress = usePlayerStore((s) => s.tickLocalProgress);

  const query = useQuery({
    queryKey: ['playback-state'],
    queryFn: playbackApi.getPlaybackState,
    enabled: isAuthenticated,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    setIsPolling(query.isFetching);
  }, [query.isFetching, setIsPolling]);

  useEffect(() => {
    if (query.data !== undefined) setPlayback(query.data);
  }, [query.data, setPlayback]);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    tickRef.current = setInterval(() => tickLocalProgress(LOCAL_TICK_MS), LOCAL_TICK_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [tickLocalProgress]);

  return { isLoading: query.isLoading, error: query.error };
}

/** Playback control mutations, each invalidating the polled state on success. */
export function usePlaybackControls() {
  const queryClient = useQueryClient();
  const playback = usePlayerStore((s) => s.playback);
  const activeDeviceId = playback?.device?.id ?? undefined;

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['playback-state'] });
  }, [queryClient]);

  const playMutation = useMutation({
    mutationFn: (opts: Parameters<typeof playbackApi.play>[0] | void) =>
      playbackApi.play({ deviceId: activeDeviceId, ...(opts ?? {}) }),
    onSuccess: invalidate,
  });

  const pauseMutation = useMutation({
    mutationFn: () => playbackApi.pause(activeDeviceId),
    onSuccess: invalidate,
  });

  const nextMutation = useMutation({
    mutationFn: () => playbackApi.skipToNext(activeDeviceId),
    onSuccess: invalidate,
  });

  const previousMutation = useMutation({
    mutationFn: () => playbackApi.skipToPrevious(activeDeviceId),
    onSuccess: invalidate,
  });

  const seekMutation = useMutation({
    mutationFn: (positionMs: number) => playbackApi.seek(positionMs, activeDeviceId),
    onSuccess: invalidate,
  });

  const volumeMutation = useMutation({
    mutationFn: (percent: number) => playbackApi.setVolume(percent, activeDeviceId),
  });

  const shuffleMutation = useMutation({
    mutationFn: (state: boolean) => playbackApi.setShuffle(state, activeDeviceId),
    onSuccess: invalidate,
  });

  const repeatMutation = useMutation({
    mutationFn: (state: RepeatState) => playbackApi.setRepeat(state, activeDeviceId),
    onSuccess: invalidate,
  });

  const transferMutation = useMutation({
    mutationFn: ({ deviceId, play }: { deviceId: string; play?: boolean }) =>
      playbackApi.transferPlayback(deviceId, play),
    onSuccess: invalidate,
  });

  const addToQueueMutation = useMutation({
    mutationFn: (uri: string) => playbackApi.addToQueue(uri, activeDeviceId),
  });

  return {
    play: playMutation.mutate,
    pause: pauseMutation.mutate,
    next: nextMutation.mutate,
    previous: previousMutation.mutate,
    seek: seekMutation.mutate,
    setVolume: volumeMutation.mutate,
    setShuffle: shuffleMutation.mutate,
    setRepeat: repeatMutation.mutate,
    transferPlayback: transferMutation.mutate,
    addToQueue: addToQueueMutation.mutate,
    isMutating:
      playMutation.isPending ||
      pauseMutation.isPending ||
      nextMutation.isPending ||
      previousMutation.isPending,
  };
}

export function useAvailableDevices() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setDevices = usePlayerStore((s) => s.setDevices);

  const query = useQuery({
    queryKey: ['devices'],
    queryFn: playbackApi.getAvailableDevices,
    enabled: isAuthenticated,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (query.data) setDevices(query.data);
  }, [query.data, setDevices]);

  return query;
}

export function useQueue() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['queue'],
    queryFn: playbackApi.getQueue,
    enabled: isAuthenticated,
    refetchInterval: POLL_INTERVAL_MS * 2,
  });
}
