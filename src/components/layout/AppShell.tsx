import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NowPlayingBar } from '../player/NowPlayingBar';
import { DebugPanel } from './DebugPanel';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { RowToast } from '../ui/RowToast';
import { usePlaybackSync } from '../../hooks/usePlayback';

export function AppShell() {
  // Keeps the player store synced with polled playback state for the
  // lifetime of the authenticated app — mounted once here at the root.
  usePlaybackSync();

  return (
    <div className="flex h-screen flex-col bg-console-950">
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-screen-2xl">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
      <NowPlayingBar />
      <DebugPanel />
      <RowToast />
    </div>
  );
}
