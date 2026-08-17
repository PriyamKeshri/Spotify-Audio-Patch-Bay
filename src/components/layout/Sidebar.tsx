import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, Home, Library, ListMusic, Plus, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUserPlaylists } from '../../hooks/usePlaylists';
import { pickImage } from '../../lib/utils';
import { CreatePlaylistModal } from '../playlist/CreatePlaylistModal';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/library', label: 'Your Library', icon: Library },
  { to: '/liked', label: 'Liked Songs', icon: Heart },
];

export function Sidebar() {
  const { data: playlists } = useUserPlaylists(30);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-console-800 bg-console-950 lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <RackLogo />
        <span className="font-display text-sm font-semibold tracking-wide text-console-100">
          SIGNAL<span className="text-signal-500">/</span>CHAIN
        </span>
      </div>

      <nav className="space-y-0.5 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-console-800 text-signal-400'
                  : 'text-console-300 hover:bg-console-900 hover:text-console-100'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 my-4 h-px bg-console-800" />

      <div className="flex min-h-0 flex-1 flex-col px-3">
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-console-500">
            <ListMusic className="h-3.5 w-3.5" /> Your playlists
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            aria-label="Create playlist"
            className="text-console-500 hover:text-signal-400"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 space-y-0.5 overflow-y-auto pb-4">
          {playlists?.items.map((playlist) => {
            const art = pickImage(playlist.images, 'small');
            return (
              <NavLink
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    isActive ? 'bg-console-800 text-console-100' : 'text-console-400 hover:text-console-200'
                  )
                }
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-console-800 text-[10px] text-console-500">
                  {art ? <img src={art} alt="" className="h-full w-full rounded object-cover" /> : '♪'}
                </div>
                <span className="truncate">{playlist.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <CreatePlaylistModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </aside>
  );
}

function RackLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="4" rx="1" className="fill-console-700" />
      <rect x="2" y="10" width="20" height="4" rx="1" className="fill-console-700" />
      <rect x="2" y="16" width="20" height="4" rx="1" className="fill-console-700" />
      <circle cx="6" cy="6" r="1" className="fill-signal-500" />
      <circle cx="6" cy="12" r="1" className="fill-tape-500" />
      <circle cx="6" cy="18" r="1" className="fill-signal-500" />
    </svg>
  );
}
