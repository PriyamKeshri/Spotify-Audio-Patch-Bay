import { create } from 'zustand';
import type { SpotifyDevice, SpotifyPlaybackState } from '../types/spotify';

interface PlayerState {
  playback: SpotifyPlaybackState | null;
  devices: SpotifyDevice[];
  isPolling: boolean;
  // Locally-optimistic progress, ticked by a client-side interval between
  // polls so the progress bar feels live rather than jumping every 3s.
  localProgressMs: number;
  lastSyncedAt: number;
  debugPanelOpen: boolean;

  setPlayback: (state: SpotifyPlaybackState | null) => void;
  setDevices: (devices: SpotifyDevice[]) => void;
  setIsPolling: (value: boolean) => void;
  tickLocalProgress: (deltaMs: number) => void;
  toggleDebugPanel: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playback: null,
  devices: [],
  isPolling: false,
  localProgressMs: 0,
  lastSyncedAt: 0,
  debugPanelOpen: false,

  setPlayback: (playback) =>
    set({
      playback,
      localProgressMs: playback?.progress_ms ?? 0,
      lastSyncedAt: Date.now(),
    }),
  setDevices: (devices) => set({ devices }),
  setIsPolling: (isPolling) => set({ isPolling }),
  tickLocalProgress: (deltaMs) => {
    const { playback, localProgressMs } = get();
    if (!playback?.is_playing || !playback.item) return;
    const next = Math.min(localProgressMs + deltaMs, playback.item.duration_ms);
    set({ localProgressMs: next });
  },
  toggleDebugPanel: () => set((s) => ({ debugPanelOpen: !s.debugPanelOpen })),
}));
