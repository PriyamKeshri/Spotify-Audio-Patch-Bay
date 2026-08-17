import { useEffect, useState } from 'react';
import { Terminal, X } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { useAuthStore } from '../../store/authStore';
import { readStoredToken } from '../../auth/tokenStore';
import { cn } from '../../lib/utils';

interface LogEntry {
  id: number;
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  durationMs?: number;
}

let logId = 0;
const listeners = new Set<(entry: LogEntry) => void>();

/** Called by the axios interceptor to publish a request into the debug log. */
export function publishDebugLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
  const full: LogEntry = {
    ...entry,
    id: ++logId,
    timestamp: new Date().toLocaleTimeString(undefined, { hour12: false }),
  };
  listeners.forEach((l) => l(full));
}

function useDebugLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  useEffect(() => {
    const handler = (entry: LogEntry) => setEntries((prev) => [entry, ...prev].slice(0, 50));
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);
  return entries;
}

export function DebugPanel() {
  const isOpen = usePlayerStore((s) => s.debugPanelOpen);
  const toggle = usePlayerStore((s) => s.toggleDebugPanel);
  const playback = usePlayerStore((s) => s.playback);
  const isPolling = usePlayerStore((s) => s.isPolling);
  const authError = useAuthStore((s) => s.authError);
  const logs = useDebugLog();
  const token = readStoredToken();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-console-700 bg-console-900/98 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center justify-between border-b border-console-700 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-console-300">
          <Terminal className="h-4 w-4 text-signal-500" />
          Signal Monitor
        </div>
        <button onClick={toggle} className="text-console-400 hover:text-console-100" aria-label="Close debug panel">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        <Section title="Auth">
          <Row label="Status" value={token ? 'authenticated' : 'signed out'} good={Boolean(token)} />
          {token && (
            <>
              <Row
                label="Token expires"
                value={new Date(token.expiresAt).toLocaleTimeString()}
              />
              <Row label="Scopes" value={`${token.scope.split(' ').length} granted`} />
            </>
          )}
          {authError && <Row label="Last error" value={authError} good={false} />}
        </Section>

        <Section title="Playback poll">
          <Row label="Polling" value={isPolling ? 'fetching…' : 'idle'} />
          <Row label="Active device" value={playback?.device?.name ?? 'none'} />
          <Row label="Is playing" value={String(playback?.is_playing ?? false)} />
          <Row label="Track" value={playback?.item?.name ?? '—'} />
          <Row label="Progress" value={`${playback?.progress_ms ?? 0}ms`} />
        </Section>

        <Section title={`Request log (${logs.length})`}>
          {logs.length === 0 && <p className="text-console-500">No requests yet.</p>}
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-2 rounded bg-console-950 px-2 py-1.5">
                <span className="text-console-500">{log.timestamp}</span>
                <span
                  className={cn(
                    'font-semibold',
                    log.method === 'GET' ? 'text-tape-400' : 'text-signal-400'
                  )}
                >
                  {log.method}
                </span>
                <span className="flex-1 truncate text-console-300">{log.url}</span>
                <span
                  className={cn(
                    log.status && log.status >= 400 ? 'text-alert-500' : 'text-console-400'
                  )}
                >
                  {log.status ?? '…'}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-widest text-console-500">{title}</p>
      <div className="space-y-1 rounded-lg border border-console-800 bg-console-950/60 p-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-console-500">{label}</span>
      <span
        className={cn(
          'truncate text-right',
          good === true && 'text-signal-400',
          good === false && 'text-alert-500',
          good === undefined && 'text-console-200'
        )}
      >
        {value}
      </span>
    </div>
  );
}
