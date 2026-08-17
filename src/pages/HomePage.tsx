import { useNavigate } from 'react-router-dom';
import { useRecentlyPlayed, useTopTracks } from '../hooks/useDiscovery';
import { useUserPlaylists } from '../hooks/usePlaylists';
import { usePlaybackControls } from '../hooks/usePlayback';
import { useTrackSavedStatus, useToggleSavedTrack } from '../hooks/useLibrary';
import { MediaRail } from '../components/discovery/MediaRail';
import { MediaCard, mediaCardImage } from '../components/discovery/MediaCard';
import { TrackRow } from '../components/discovery/TrackRow';
import { useAuthStore } from '../store/authStore';
import { usePlayerStore } from '../store/playerStore';
import { VuMeter } from '../components/visualizer/VuMeter';

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { playFromRow, addToQueue } = usePlaybackControls();
  const { save, remove } = useToggleSavedTrack();

  const currentTrackId = usePlayerStore((s) => s.playback?.item?.id);
  const isPlaying = usePlayerStore((s) => s.playback?.is_playing ?? false);

  const { data: recentlyPlayed, isLoading: loadingRecent } = useRecentlyPlayed(10);
  const { data: topTracks, isLoading: loadingTop } = useTopTracks('short_term', 10);
  const { data: playlists, isLoading: loadingPlaylists } = useUserPlaylists(12);

  const recentTracks = recentlyPlayed?.map((item) => item.track) ?? [];
  const trackIds = [...recentTracks.map((t) => t.id), ...(topTracks?.map((t) => t.id) ?? [])];
  const { data: savedStatus } = useTrackSavedStatus(trackIds);
  const savedMap = new Map(trackIds.map((id, i) => [id, savedStatus?.[i] ?? false]));

  const greeting = getGreeting();

  return (
    <div className="space-y-10 pb-10">
      <div>
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-signal-500">
          <VuMeter isPlaying={isPlaying} barCount={3} className="h-2.5" />
          Console online
        </div>
        <h1 className="font-display text-3xl font-semibold text-console-100">
          {greeting}
          {user?.display_name ? `, ${user.display_name.split(' ')[0]}` : ''}
        </h1>
      </div>

      {playlists && playlists.items.length > 0 && (
        <MediaRail title="Your playlists" eyebrow="Patched in" isLoading={loadingPlaylists}>
          {playlists.items.filter(Boolean).map((playlist) => (
            <MediaCard
              key={playlist.id}
              title={playlist.name}
              subtitle={`${playlist.items?.total ?? 0} tracks`}
              imageUrl={mediaCardImage(playlist.images)}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              onPlay={(e) => playFromRow(e, { contextUri: `spotify:playlist:${playlist.id}` })}
            />
          ))}
        </MediaRail>
      )}

      <section>
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-signal-500">
            Playback history
          </span>
          <h2 className="font-display text-xl font-semibold text-console-100">Recently played</h2>
        </div>
        <div className="space-y-0.5">
          {loadingRecent && (
            <p className="py-4 text-sm text-console-500">Reading playback history…</p>
          )}
          {!loadingRecent && recentTracks.length === 0 && (
            <p className="py-4 text-sm text-console-500">
              Nothing played yet — play something on Spotify and it'll show up here.
            </p>
          )}
          {recentTracks.map((track, i) => (
            <TrackRow
              key={`${track.id}-${i}`}
              track={track}
              index={i + 1}
              isActive={track.id === currentTrackId}
              isPlaying={isPlaying}
              isSaved={savedMap.get(track.id)}
              onPlay={(e) => playFromRow(e, { uris: [track.uri] })}
              onToggleSave={() => (savedMap.get(track.id) ? remove(track.id) : save(track.id))}
              onAddToQueue={() => addToQueue(track.uri)}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-tape-500">
            This month
          </span>
          <h2 className="font-display text-xl font-semibold text-console-100">Your top tracks</h2>
        </div>
        <div className="space-y-0.5">
          {loadingTop && <p className="py-4 text-sm text-console-500">Calculating your top tracks…</p>}
          {!loadingTop && (topTracks?.length ?? 0) === 0 && (
            <p className="py-4 text-sm text-console-500">
              Not enough listening history yet to calculate your top tracks.
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Late session';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
