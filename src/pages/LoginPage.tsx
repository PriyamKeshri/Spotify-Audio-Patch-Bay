import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { CLIENT_ID } from '../auth/config';
import { VuMeter } from '../components/visualizer/VuMeter';

export function LoginPage() {
  const { login } = useAuth();
  const [starting, setStarting] = useState(false);
  const missingClientId = !CLIENT_ID;

  return (
    <div className="flex min-h-screen items-center justify-center bg-console-950 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-3">
            <RackMark />
            <span className="font-display text-lg font-semibold tracking-wide text-console-100">
              SIGNAL<span className="text-signal-500">/</span>CHAIN
            </span>
          </div>
          <p className="max-w-xs text-sm text-console-400">
            A patch bay for your Spotify account — full playback control, discovery, and
            library management, routed through the Web API.
          </p>
        </div>

        <div className="panel-brushed rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between border-b border-console-800 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-console-500">
              Input status
            </span>
            <div className="flex items-center gap-2">
              <span className="led led--off h-2 w-2" />
              <span className="font-mono text-[11px] text-console-500">no signal</span>
            </div>
          </div>

          <VuMeter isPlaying={false} barCount={12} className="mb-6 h-10 w-full justify-center gap-1" />

          {missingClientId ? (
            <div className="flex items-start gap-2 rounded-lg border border-alert-500/30 bg-alert-500/10 p-3 text-xs text-alert-500">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                No Spotify client ID configured. Set{' '}
                <code className="rounded bg-console-900 px-1 py-0.5">VITE_SPOTIFY_CLIENT_ID</code> in
                your <code className="rounded bg-console-900 px-1 py-0.5">.env</code> file — see the
                README for setup steps.
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                setStarting(true);
                login();
              }}
              disabled={starting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-signal-500 px-4 py-3 text-sm font-semibold text-console-950 transition-colors hover:bg-signal-400 disabled:opacity-60"
            >
              {starting ? 'Connecting…' : 'Connect with Spotify'}
            </button>
          )}

          <p className="mt-4 text-center text-[11px] leading-relaxed text-console-500">
            Uses OAuth 2.0 with PKCE — your credentials are never seen or stored by this app.
            Playback control requires Spotify Premium.
          </p>
        </div>
      </div>
    </div>
  );
}

function RackMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="4" rx="1" className="fill-console-700" />
      <rect x="2" y="10" width="20" height="4" rx="1" className="fill-console-700" />
      <rect x="2" y="16" width="20" height="4" rx="1" className="fill-console-700" />
      <circle cx="6" cy="6" r="1" className="fill-signal-500" />
      <circle cx="6" cy="12" r="1" className="fill-tape-500" />
      <circle cx="6" cy="18" r="1" className="fill-signal-500" />
    </svg>
  );
}
