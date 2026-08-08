import { Heart, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Pause, Play, ListMusic } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { usePlaybackControls } from '../../hooks/usePlayback';
import { useTrackSavedStatus, useToggleSavedTrack } from '../../hooks/useLibrary';
import { ProgressScrubber } from './ProgressScrubber';
import { VolumeFader } from './VolumeFader';
import { DevicePicker } from './DevicePicker';
import { Waveform } from '../visualizer/Waveform';
import { cn, joinArtistNames, pickImage } from '../../lib/utils';
import type { RepeatState } from '../../types/spotify';

const repeatCycle: RepeatState[] = ['off', 'context', 'track'];

export function NowPlayingBar() {
  const playback = usePlayerStore((s) => s.playback);
  const localProgressMs = usePlayerStore((s) => s.localProgressMs);
  const { play, pause, next, previous, seek, setVolume, setShuffle, setRepeat } = usePlaybackControls();

  const track = playback?.item ?? null;
  const trackIds = track ? [track.id] : [];
  const { data: savedStatus } = useTrackSavedStatus(trackIds);
  const { save, remove } = useToggleSavedTrack();
  const isSaved = savedStatus?.[0] ?? false;

  if (!track) {
    return (
      <footer className="panel-brushed sticky bottom-0 z-30 flex h-20 items-center justify-center border-t px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-console-500">
          Nothing patched in — open Spotify on a device and start playback
        </p>
      </footer>
    );
  }

  const art = pickImage(track.album.images, 'small');
  const isPlaying = playback?.is_playing ?? false;
  const repeatState = playback?.repeat_state ?? 'off';
  const shuffleOn = playback?.shuffle_state ?? false;

  const RepeatIcon = repeatState === 'track' ? Repeat1 : Repeat;

  return (
    <footer className="panel-brushed sticky bottom-0 z-30 border-t px-4 py-3">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-[1fr_2fr_1fr] items-center gap-4">
        {/* Now playing info */}
        <div className="flex min-w-0 items-center gap-3">
          {art && <img src={art} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover shadow-lg" />}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-console-100">{track.name}</p>
            <p className="truncate text-xs text-console-400">{joinArtistNames(track.artists)}</p>
          </div>
          <button
            onClick={() => (isSaved ? remove(track.id) : save(track.id))}
            aria-label={isSaved ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
            className={cn('ml-2 shrink-0 hover:text-signal-500', isSaved ? 'text-signal-500' : 'text-console-500')}
          >
            <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </button>
        </div>

        {/* Transport controls */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShuffle(!shuffleOn)}
              aria-label="Toggle shuffle"
              aria-pressed={shuffleOn}
              className={cn('hover:text-console-100', shuffleOn ? 'text-signal-500' : 'text-console-400')}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              onClick={() => previous()}
              aria-label="Previous track"
              className="text-console-200 hover:text-console-100"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={() => (isPlaying ? pause() : play())}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-console-100 text-console-950 transition-transform hover:scale-105"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </button>
            <button
              onClick={() => next()}
              aria-label="Next track"
              className="text-console-200 hover:text-console-100"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={() => setRepeat(repeatCycle[(repeatCycle.indexOf(repeatState) + 1) % repeatCycle.length])}
              aria-label="Toggle repeat"
              aria-pressed={repeatState !== 'off'}
              className={cn('hover:text-console-100', repeatState !== 'off' ? 'text-signal-500' : 'text-console-400')}
            >
              <RepeatIcon className="h-4 w-4" />
            </button>
          </div>
          <ProgressScrubber
            progressMs={localProgressMs}
            durationMs={track.duration_ms}
            onSeek={(ms) => seek(ms)}
          />
        </div>

        {/* Waveform + volume + device */}
        <div className="flex items-center justify-end gap-4">
          <Waveform
            isPlaying={isPlaying}
            progress={track.duration_ms > 0 ? localProgressMs / track.duration_ms : 0}
            seed={track.id}
            className="hidden w-28 lg:flex"
          />
          <ListMusic className="hidden h-4 w-4 text-console-500 sm:block" />
          <VolumeFader
            volume={playback?.device?.volume_percent ?? 50}
            onChange={(v) => setVolume(v)}
          />
          <DevicePicker />
        </div>
      </div>
    </footer>
  );
}
