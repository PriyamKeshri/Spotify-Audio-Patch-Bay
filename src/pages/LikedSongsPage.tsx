import { Heart } from 'lucide-react';
import { useSavedTracks } from '../hooks/useLibrary';
import { useToggleSavedTrack } from '../hooks/useLibrary';
import { usePlaybackControls } from '../hooks/usePlayback';
import { TrackRow } from '../components/discovery/TrackRow';
import { SkeletonRow } from '../components/ui/Loading';
import { usePlayerStore } from '../store/playerStore';

export function LikedSongsPage() {
  const { data, isLoading } = useSavedTracks(50);
  const { remove } = useToggleSavedTrack();
  const { play, addToQueue } = usePlaybackControls();
  const currentTrackId = usePlayerStore((s) => s.playback?.item?.id);
  const isPlaying = usePlayerStore((s) => s.playback?.is_playing ?? false);

  const uris = data?.items.map((e) => e.track.uri) ?? [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-end gap-5">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-signal-600 to-console-800">
          <Heart className="h-12 w-12 fill-console-100 text-console-100" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-console-500">Playlist</p>
          <h1 className="font-display text-4xl font-semibold text-console-100">Liked Songs</h1>
          <p className="mt-1 text-sm text-console-400">{data?.total ?? 0} songs</p>
        </div>
      </div>

      <div className="space-y-0.5">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        {data?.items.map((entry, i) => (
          <TrackRow
            key={entry.track.id}
            track={entry.track}
            index={i + 1}
            isActive={entry.track.id === currentTrackId}
            isPlaying={isPlaying}
            isSaved
            onPlay={() => play({ uris, offset: { uri: entry.track.uri } })}
            onToggleSave={() => remove(entry.track.id)}
            onAddToQueue={() => addToQueue(entry.track.uri)}
          />
        ))}
        {!isLoading && data?.items.length === 0 && (
          <p className="py-10 text-center text-sm text-console-500">
            Songs you like will show up here — tap the heart on any track.
          </p>
        )}
      </div>
    </div>
  );
}
