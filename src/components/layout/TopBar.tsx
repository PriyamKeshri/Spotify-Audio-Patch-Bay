import { useNavigate } from 'react-router-dom';
import { LogOut, Terminal, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePlayerStore } from '../../store/playerStore';
import { cn, pickImage } from '../../lib/utils';

export function TopBar() {
  const { user, logout } = useAuth();
  const toggleDebugPanel = usePlayerStore((s) => s.toggleDebugPanel);
  const debugPanelOpen = usePlayerStore((s) => s.debugPanelOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const avatar = pickImage(user?.images, 'small');

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-console-800 bg-console-950/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-console-800 text-console-300 hover:text-console-100"
          aria-label="Go back"
        >
          ‹
        </button>
        <button
          onClick={() => navigate(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-console-800 text-console-300 hover:text-console-100"
          aria-label="Go forward"
        >
          ›
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDebugPanel}
          aria-label="Toggle signal monitor"
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors',
            debugPanelOpen
              ? 'border-signal-500/50 text-signal-400'
              : 'border-console-700 text-console-400 hover:text-console-200'
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
          Monitor
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-console-700 bg-console-900 py-1 pl-1 pr-3 hover:border-console-600"
          >
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-console-700">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-3.5 w-3.5 text-console-400" />
              )}
            </div>
            <span className="max-w-[120px] truncate text-xs font-medium text-console-200">
              {user?.display_name ?? 'Account'}
            </span>
          </button>

          {menuOpen && (
            <div
              className="panel-brushed absolute right-0 top-10 z-20 w-48 rounded-lg p-1"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-console-200 hover:bg-console-700"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
