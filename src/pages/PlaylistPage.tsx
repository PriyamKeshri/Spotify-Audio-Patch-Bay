import { useParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import { usePlaylist, usePlaylistTracks } from '../hooks/usePlaylists';
import { usePlaybackControls } from '../hooks/usePlayback';
import { useTrackSavedStatus, useToggleSavedTrack } from '../hooks/useLibrary';
import { TrackRow } from '../components/discovery/TrackRow';
import { SkeletonRow } from '../components/ui/Loading';
import { pickImage } from '../lib/utils';
import { usePlayerStore } from '../store/playerStore';
import { Button } from '../components/ui/Button';

export function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { data: playlist, isLoading: loadingMeta } = usePlaylist(playlistId);
  const { data: tracksPage, isLoading: loadingTracks } = usePlaylistTracks(playlistId);
  const { play, addToQueue } = usePlaybackControls();
  const { save, remove } = useToggleSavedTrack();

  const currentTrackId = usePlayerStore((s) => s.playback?.item?.id);
  const isPlaying = usePlayerStore((s) => s.playback?.is_playing ?? false);

  const tracks = tracksPage?.items.map((i) => i.track).filter(Boolean) ?? [];
  const trackIds = tracks.map((t) => t.id);
  const { data: savedStatus } = useTrackSavedStatus(trackIds);
  const savedMap = new Map(trackIds.map((id, i) => [id, savedStatus?.[i] ?? false]));

  const art = pickImage(playlist?.images, 'large');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-end gap-5">
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-console-800 shadow-lg">
          {art ? (
            <img src={art} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-console-600">♪</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-console-500">
            {playlist?.public ? 'Public playlist' : 'Playlist'}
          </p>
          <h1 className="truncate font-display text-4xl font-semibold text-console-100">
            {loadingMeta ? 'Loading…' : playlist?.name}
          </h1>
          {playlist?.description && (
            <p className="mt-1 text-sm text-console-400">{playlist.description}</p>
          )}
          <p className="mt-1 text-sm text-console-500">
            By {playlist?.owner?.display_name ?? '—'} · {playlist?.items?.total ?? 0} tracks
          </p>
        </div>
      </div>

      {playlistId && tracks.length > 0 && (
        <Button
          variant="primary"
          className="rounded-full"
          onClick={() => play({ contextUri: `spotify:playlist:${playlistId}` })}
        >
          <Play className="h-4 w-4 fill-current" /> Play
        </Button>
      )}

      <div className="space-y-0.5">
        {loadingTracks && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        {tracks.map((track, i) => (
          <TrackRow
            key={`${track.id}-${i}`}
            track={track}
            index={i + 1}
            isActive={track.id === currentTrackId}
            isPlaying={isPlaying}
            isSaved={savedMap.get(track.id)}
            onPlay={() =>
              play({ contextUri: playlistId ? `spotify:playlist:${playlistId}` : undefined, offset: { position: i } })
            }
            onToggleSave={() => (savedMap.get(track.id) ? remove(track.id) : save(track.id))}
            onAddToQueue={() => addToQueue(track.uri)}
          />
        ))}
      </div>
    </div>
  );
}
