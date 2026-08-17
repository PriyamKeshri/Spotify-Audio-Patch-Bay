import { spotifyClient } from './client';
import type { RepeatState, SpotifyDevice, SpotifyPlaybackState, SpotifyQueue } from '../types/spotify';

// Playback endpoints return 204 No Content on success for most write actions,
// and 204 (not 200 + null) from GET /me/player when nothing is active —
// axios surfaces that as `data === ''`, so callers should treat falsy as "no state".

export async function getPlaybackState(): Promise<SpotifyPlaybackState | null> {
  const { data } = await spotifyClient.get<SpotifyPlaybackState | ''>('/me/player');
  return data || null;
}

export async function getAvailableDevices(): Promise<SpotifyDevice[]> {
  const { data } = await spotifyClient.get<{ devices: SpotifyDevice[] }>('/me/player/devices');
  return data.devices;
}

export async function getQueue(): Promise<SpotifyQueue> {
  const { data } = await spotifyClient.get<SpotifyQueue>('/me/player/queue');
  return data;
}

interface PlayOptions {
  deviceId?: string;
  contextUri?: string; // playlist/album/artist URI
  uris?: string[]; // specific track URIs
  offset?: { position: number } | { uri: string };
  positionMs?: number;
}

export async function play(options: PlayOptions = {}): Promise<void> {
  const params = options.deviceId ? { device_id: options.deviceId } : undefined;
  const body: Record<string, unknown> = {};
  if (options.contextUri) body.context_uri = options.contextUri;
  if (options.uris) body.uris = options.uris;
  if (options.offset) body.offset = options.offset;
  if (options.positionMs !== undefined) body.position_ms = options.positionMs;
  await spotifyClient.put('/me/player/play', body, { params });
}

export async function pause(deviceId?: string): Promise<void> {
  await spotifyClient.put('/me/player/pause', null, {
    params: deviceId ? { device_id: deviceId } : undefined,
  });
}

export async function skipToNext(deviceId?: string): Promise<void> {
  await spotifyClient.post('/me/player/next', null, {
    params: deviceId ? { device_id: deviceId } : undefined,
  });
}

export async function skipToPrevious(deviceId?: string): Promise<void> {
  await spotifyClient.post('/me/player/previous', null, {
    params: deviceId ? { device_id: deviceId } : undefined,
  });
}

export async function seek(positionMs: number, deviceId?: string): Promise<void> {
  await spotifyClient.put('/me/player/seek', null, {
    params: { position_ms: Math.round(positionMs), ...(deviceId ? { device_id: deviceId } : {}) },
  });
}

export async function setVolume(volumePercent: number, deviceId?: string): Promise<void> {
  await spotifyClient.put('/me/player/volume', null, {
    params: {
      volume_percent: Math.round(Math.min(100, Math.max(0, volumePercent))),
      ...(deviceId ? { device_id: deviceId } : {}),
    },
  });
}

export async function setShuffle(state: boolean, deviceId?: string): Promise<void> {
  await spotifyClient.put('/me/player/shuffle', null, {
    params: { state, ...(deviceId ? { device_id: deviceId } : {}) },
  });
}

export async function setRepeat(state: RepeatState, deviceId?: string): Promise<void> {
  await spotifyClient.put('/me/player/repeat', null, {
    params: { state, ...(deviceId ? { device_id: deviceId } : {}) },
  });
}

export async function addToQueue(uri: string, deviceId?: string): Promise<void> {
  await spotifyClient.post('/me/player/queue', null, {
    params: { uri, ...(deviceId ? { device_id: deviceId } : {}) },
  });
}

export async function transferPlayback(deviceId: string, play = false): Promise<void> {
  await spotifyClient.put('/me/player', { device_ids: [deviceId], play });
}
