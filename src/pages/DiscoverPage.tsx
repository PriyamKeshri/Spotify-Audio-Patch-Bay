import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useTopArtists, useTopTracks, type TopTimeRange } from '../hooks/useDiscovery';
import { usePlaybackControls } from '../hooks/usePlayback';
import { useTrackSavedStatus, useToggleSavedTrack } from '../hooks/useLibrary';
import { TrackRow } from '../components/discovery/TrackRow';
import { MediaRail } from '../components/discovery/MediaRail';
import { MediaCard, mediaCardImage } from '../components/discovery/MediaCard';
import { cn } from '../lib/utils';
import { usePlayerStore } from '../store/playerStore';

const ranges: { key: TopTimeRange; label: string }[] = [
  { key: 'short_term', label: 'Last 4 weeks' },
  { key: 'medium_term', label: 'Last 6 months' },
  { key: 'long_term', label: 'All time' },
];

export function DiscoverPage() {
  const [range, setRange] = useState<TopTimeRange>('short_term');
  const { data: topTracks, isFetching: loadingTracks } = useTopTracks(range, 20);
  const { data: topArtists, isFetching: loadingArtists } = useTopArtists(range, 12);
  const { playFromRow, addToQueue } = usePlaybackControls();
  const { save, remove } = useToggleSavedTrack();

  const currentTrackId = usePlayerStore((s) => s.playback?.item?.id);
  const isPlaying = usePlayerStore((s) => s.playback?.is_playing ?? false);

  const trackIds = topTracks?.map((t) => t.id) ?? [];
  const { data: savedStatus } = useTrackSavedStatus(trackIds);
  const savedMap = new Map(trackIds.map((id, i) => [id, savedStatus?.[i] ?? false]));

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-tape-500">
          <Sparkles className="h-3.5 w-3.5" />
          Listening profile
        </div>
        <h1 className="font-display text-3xl font-semibold text-console-100">Discover</h1>
        <p className="mt-1 text-sm text-console-400">
          Your most-played tracks and artists, straight from the signal — no curated playlists
          required.
        </p>
      </div>

      <div className="flex gap-2">
        {ranges.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs transition-colors',
              range === key
                ? 'border-signal-500 bg-signal-500/15 text-signal-400'
                : 'border-console-700 text-console-400 hover:text-console-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <MediaRail title="Top artists" eyebrow="Most played" isLoading={loadingArtists}>
        {topArtists?.map((artist) => (
          <MediaCard
            key={artist.id}
            title={artist.name}
            subtitle="Artist"
            circular
            imageUrl={mediaCardImage(artist.images)}
            onClick={() => window.open(artist.external_urls.spotify, '_blank')}
          />
        ))}
      </MediaRail>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-console-100">Top tracks</h2>
        <div className="space-y-0.5">
          {loadingTracks && (
            <p className="py-4 text-sm text-console-500">Calculating your top tracks…</p>
          )}
          {!loadingTracks && (topTracks?.length ?? 0) === 0 && (
            <p className="py-4 text-sm text-console-500">
              Not enough listening history in this range yet. Try a wider range, or keep
              listening — Spotify needs some plays before it can rank anything.
            </p>
          )}
          {topTracks?.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i + 1}
              isActive={track.id === currentTrackId}
              isPlaying={isPlaying}
              isSaved={savedMap.get(track.id)}
              onPlay={(e) => playFromRow(e, { uris: topTracks.map((t) => t.uri), offset: { uri: track.uri } })}
              onToggleSave={() => (savedMap.get(track.id) ? remove(track.id) : save(track.id))}
              onAddToQueue={() => addToQueue(track.uri)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
