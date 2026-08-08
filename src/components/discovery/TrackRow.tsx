import { Heart, MoreHorizontal, Pause, Play, Plus } from 'lucide-react';
import { useState } from 'react';
import type { SpotifyTrack } from '../../types/spotify';
import { cn, formatDuration, joinArtistNames, pickImage } from '../../lib/utils';
import { VuMeter } from '../visualizer/VuMeter';

interface TrackRowProps {
  track: SpotifyTrack;
  index?: number;
  isActive?: boolean;
  isPlaying?: boolean;
  isSaved?: boolean;
  onPlay?: () => void;
  onToggleSave?: () => void;
  onAddToQueue?: () => void;
  showAlbum?: boolean;
}

export function TrackRow({
  track,
  index,
  isActive,
  isPlaying,
  isSaved,
  onPlay,
  onToggleSave,
  onAddToQueue,
  showAlbum = true,
}: TrackRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const art = pickImage(track.album?.images, 'small');

  return (
    <div
      className={cn(
        'group grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-md px-3 py-2 hover:bg-console-800',
        isActive && 'bg-console-800/70'
      )}
    >
      <div className="flex w-6 items-center justify-center text-sm text-console-500">
        {isActive ? (
          <VuMeter isPlaying={Boolean(isPlaying)} barCount={3} className="h-3.5" />
        ) : onPlay ? (
          <>
            <span className="group-hover:hidden">{index}</span>
            <button
              onClick={onPlay}
              className="hidden text-console-100 group-hover:block"
              aria-label={`Play ${track.name}`}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
            </button>
          </>
        ) : (
          <span>{index}</span>
        )}
      </div>

      <div className="flex min-w-0 items-center gap-3">
        {art && (
          <img src={art} alt="" className="h-10 w-10 shrink-0 rounded object-cover" loading="lazy" />
        )}
        <div className="min-w-0">
          <p className={cn('truncate text-sm font-medium', isActive ? 'text-signal-400' : 'text-console-100')}>
            {track.name}
          </p>
          <p className="truncate text-xs text-console-400">
            {joinArtistNames(track.artists)}
            {showAlbum && track.album?.name && (
              <span className="text-console-600"> · {track.album.name}</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-console-400">
        {onToggleSave && (
          <button
            onClick={onToggleSave}
            aria-label={isSaved ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
            className={cn(
              'opacity-0 transition-opacity group-hover:opacity-100 hover:text-signal-500',
              isSaved && 'opacity-100 text-signal-500'
            )}
          >
            <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </button>
        )}
        <span className="w-10 text-right font-mono text-xs">{formatDuration(track.duration_ms)}</span>
        {onAddToQueue && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More options"
              className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-console-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div
                className="panel-brushed absolute right-0 top-6 z-10 min-w-[160px] rounded-lg p-1"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    onAddToQueue();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-console-200 hover:bg-console-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to queue
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TrackRowPlayIcon({ isPlaying }: { isPlaying: boolean }) {
  return isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />;
}
