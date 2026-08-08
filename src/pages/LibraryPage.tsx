import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '../hooks/usePlaylists';
import { useSavedAlbums, useFollowedArtists } from '../hooks/useLibrary';
import { usePlaybackControls } from '../hooks/usePlayback';
import { MediaRail } from '../components/discovery/MediaRail';
import { MediaCard, mediaCardImage } from '../components/discovery/MediaCard';
import { cn, joinArtistNames } from '../lib/utils';

type Tab = 'playlists' | 'albums' | 'artists';

export function LibraryPage() {
  const [tab, setTab] = useState<Tab>('playlists');
  const { data: playlists, isLoading: loadingPlaylists } = useUserPlaylists();
  const { data: albums, isLoading: loadingAlbums } = useSavedAlbums();
  const { data: artists, isLoading: loadingArtists } = useFollowedArtists();
  const { play } = usePlaybackControls();
  const navigate = useNavigate();

const tabs: { key: Tab; label: string }[] = [
  { key: 'playlists', label: `Playlists${playlists ? ` (${playlists.total ?? 0})` : ''}` },
  { key: 'albums', label: `Albums${albums ? ` (${albums.total ?? 0})` : ''}` },
  { key: 'artists', label: `Artists${artists?.artists ? ` (${artists.artists.total ?? 0})` : ''}` },
];

  return (
    <div className="space-y-6 pb-10">
      <h1 className="font-display text-3xl font-semibold text-console-100">Your Library</h1>

      <div className="flex gap-1 border-b border-console-800">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              tab === key
                ? 'border-signal-500 text-console-100'
                : 'border-transparent text-console-400 hover:text-console-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'playlists' && (
        <MediaRail title="Your playlists" isLoading={loadingPlaylists}>
          {playlists?.items.filter(Boolean).map((playlist) => (
            <MediaCard
              key={playlist.id}
              title={playlist.name}
              subtitle={`${playlist.items?.total ?? 0} tracks`}
              imageUrl={mediaCardImage(playlist.images)}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              onPlay={() => play({ contextUri: `spotify:playlist:${playlist.id}` })}
            />
          ))}
        </MediaRail>
      )}

      {tab === 'albums' && (
        <MediaRail title="Saved albums" isLoading={loadingAlbums}>
          {albums?.items.map(({ album }) => (
            <MediaCard
              key={album.id}
              title={album.name}
              subtitle={joinArtistNames(album.artists)}
              imageUrl={mediaCardImage(album.images)}
              onClick={() => window.open(album.external_urls.spotify, '_blank')}
              onPlay={() => play({ contextUri: `spotify:album:${album.id}` })}
            />
          ))}
        </MediaRail>
      )}

      {tab === 'artists' && (
        <MediaRail title="Following" isLoading={loadingArtists}>
          {artists?.artists?.items.map((artist) => (
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
      )}
    </div>
  );
}
