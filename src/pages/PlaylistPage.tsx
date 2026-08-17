import { useState, type DragEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';
import {
  usePlaylist,
  usePlaylistTracks,
  usePlaylistFollowedStatus,
  useToggleFollowPlaylist,
  useRemoveTracksFromPlaylist,
  useReorderPlaylistTracks,
} from '../hooks/usePlaylists';
import { usePlaybackControls } from '../hooks/usePlayback';
import { useTrackSavedStatus, useToggleSavedTrack } from '../hooks/useLibrary';
import { useAuthStore } from '../store/authStore';
import { TrackRow } from '../components/discovery/TrackRow';
import { SkeletonRow } from '../components/ui/Loading';
import { cn, pickImage } from '../lib/utils';
import { usePlayerStore } from '../store/playerStore';
import { Button } from '../components/ui/Button';

export function PlaylistPage() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { data: playlist, isLoading: loadingMeta } = usePlaylist(playlistId);
  const { data: tracksPage, isLoading: loadingTracks } = usePlaylistTracks(playlistId);
  const { playFromRow, addToQueue } = usePlaybackControls();
  const { save, remove } = useToggleSavedTrack();
  const user = useAuthStore((s) => s.user);

  const currentTrackId = usePlayerStore((s) => s.playback?.item?.id);
  const isPlaying = usePlayerStore((s) => s.playback?.is_playing ?? false);

  const tracks = tracksPage?.items.map((i) => i.item).filter(Boolean) ?? [];
  const trackIds = tracks.map((t) => t.id);
  const { data: savedStatus } = useTrackSavedStatus(trackIds);
  const savedMap = new Map(trackIds.map((id, i) => [id, savedStatus?.[i] ?? false]));

  const isOwner = Boolean(user && playlist && user.id === playlist.owner.id);

  // Follow/unfollow only makes sense for playlists you don't own — unfollowing
  // your own playlist removes it from your library entirely.
  const followIds = !isOwner && playlistId ? [playlistId] : [];
  const { data: followedStatus } = usePlaylistFollowedStatus(followIds);
  const isFollowing = followedStatus?.[0] ?? false;
  const { follow, unfollow } = useToggleFollowPlaylist();

  const removeTrack = useRemoveTracksFromPlaylist(playlistId ?? '');
  const reorderTracks = useReorderPlaylistTracks(playlistId ?? '');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDrop = (dropIndex: number) => {
    if (dragIndex !== null && dragIndex !== dropIndex) {
      const insertBefore = dropIndex > dragIndex ? dropIndex + 1 : dropIndex;
      reorderTracks.mutate({ rangeStart: dragIndex, insertBefore });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

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

      <div className="flex items-center gap-3">
        {playlistId && tracks.length > 0 && (
          <Button
            variant="primary"
            className="rounded-full"
            onClick={(e) => playFromRow(e, { contextUri: `spotify:playlist:${playlistId}` })}
          >
            <Play className="h-4 w-4 fill-current" /> Play
          </Button>
        )}
        {playlistId && !isOwner && (
          <button
            onClick={() =>
              isFollowing
                ? unfollow(playlistId)
                : follow({ id: playlistId, isPublic: playlist?.public ?? undefined })
            }
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors',
              isFollowing
                ? 'border-signal-500/40 text-signal-400'
                : 'border-console-700 text-console-300 hover:text-console-100'
            )}
          >
            <Heart className={cn('h-4 w-4', isFollowing && 'fill-current')} />
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="space-y-0.5">
        {loadingTracks && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        {isOwner && tracks.length > 1 && (
          <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-widest text-console-600">
            Drag tracks to reorder
          </p>
        )}
        {tracks.map((track, i) => (
          <TrackRow
            key={`${track.id}-${i}`}
            track={track}
            index={i + 1}
            isActive={track.id === currentTrackId}
            isPlaying={isPlaying}
            isSaved={savedMap.get(track.id)}
            onPlay={(e) =>
              playFromRow(e, {
                contextUri: playlistId ? `spotify:playlist:${playlistId}` : undefined,
                offset: { position: i },
              })
            }
            onToggleSave={() => (savedMap.get(track.id) ? remove(track.id) : save(track.id))}
            onAddToQueue={() => addToQueue(track.uri)}
            onRemove={isOwner ? () => removeTrack.mutate([track.uri]) : undefined}
            draggable={isOwner}
            isDragOver={dragOverIndex === i}
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              if (dragOverIndex !== i) setDragOverIndex(i);
            }}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              handleDrop(i);
            }}
            onDragEnd={() => {
              setDragIndex(null);
              setDragOverIndex(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}
