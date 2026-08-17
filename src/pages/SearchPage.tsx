import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/useDiscovery';
import { usePlaybackControls } from '../hooks/usePlayback';
import { useTrackSavedStatus, useToggleSavedTrack } from '../hooks/useLibrary';
import { TrackRow } from '../components/discovery/TrackRow';
import { MediaCard, mediaCardImage } from '../components/discovery/MediaCard';
import { Spinner } from '../components/ui/Loading';
import { usePlayerStore } from '../store/playerStore';
import { joinArtistNames } from '../lib/utils';

export function SearchPage() {
  const { inputValue, setQuery, results, isSearching, hasQuery } = useSearch();
  const { playFromRow, addToQueue } = usePlaybackControls();
  const navigate = useNavigate();
  const currentTrackId = usePlayerStore((s) => s.playback?.item?.id);
  const isPlaying = usePlayerStore((s) => s.playback?.is_playing ?? false);

  const trackIds = results?.tracks?.items.map((t) => t.id) ?? [];
  const { data: savedStatus } = useTrackSavedStatus(trackIds);
  const { save, remove } = useToggleSavedTrack();
  const savedMap = new Map(trackIds.map((id, i) => [id, savedStatus?.[i] ?? false]));

  return (
    <div className="space-y-8 pb-10">
      <div className="relative max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-console-500" />
        <input
          value={inputValue}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks, artists, albums, playlists…"
          className="w-full rounded-full border border-console-700 bg-console-900 py-3 pl-11 pr-10 text-sm text-console-100 placeholder:text-console-500 focus:border-signal-500/50 focus:outline-none"
          autoFocus
        />
        {isSearching && (
          <Spinner className="absolute right-4 top-1/2 -translate-y-1/2" />
        )}
        {!isSearching && inputValue && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-console-500 hover:text-console-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!hasQuery && (
        <p className="font-mono text-xs uppercase tracking-widest text-console-600">
          Type to route a search query through the API
        </p>
      )}

      {hasQuery && results && (
        <div className="space-y-8">
          {results.tracks && results.tracks.items.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-console-100">Tracks</h2>
              <div className="space-y-0.5">
                {results.tracks.items.map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i + 1}
                    isActive={track.id === currentTrackId}
                    isPlaying={isPlaying}
                    isSaved={savedMap.get(track.id)}
                    onPlay={(e) => playFromRow(e, { uris: [track.uri] })}
                    onToggleSave={() =>
                      savedMap.get(track.id) ? remove(track.id) : save(track.id)
                    }
                    onAddToQueue={() => addToQueue(track.uri)}
                  />
                ))}
              </div>
            </section>
          )}

          {results.artists && results.artists.items.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-console-100">Artists</h2>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.artists.items.map((artist) => (
                  <MediaCard
                    key={artist.id}
                    title={artist.name}
                    subtitle="Artist"
                    imageUrl={mediaCardImage(artist.images)}
                    circular
                    onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                  />
                ))}
              </div>
            </section>
          )}

          {results.albums && results.albums.items.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-console-100">Albums</h2>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.albums.items.map((album) => (
                  <MediaCard
                    key={album.id}
                    title={album.name}
                    subtitle={joinArtistNames(album.artists)}
                    imageUrl={mediaCardImage(album.images)}
                    onClick={() => window.open(album.external_urls.spotify, '_blank')}
                    onPlay={(e) => playFromRow(e, { contextUri: `spotify:album:${album.id}` })}
                  />
                ))}
              </div>
            </section>
          )}

          {results.playlists && results.playlists.items.filter(Boolean).length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold text-console-100">Playlists</h2>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.playlists.items.filter(Boolean).map((playlist) => (
                  <MediaCard
                    key={playlist.id}
                    title={playlist.name}
                    subtitle={`By ${playlist.owner.display_name ?? 'Spotify'}`}
                    imageUrl={mediaCardImage(playlist.images)}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    onPlay={(e) => playFromRow(e, { contextUri: `spotify:playlist:${playlist.id}` })}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
