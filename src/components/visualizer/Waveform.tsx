import { useMemo } from 'react';
import { cn } from '../../lib/utils';

interface WaveformProps {
  isPlaying: boolean;
  progress: number; // 0..1
  seed?: string; // deterministic shape per track (e.g. track id)
  className?: string;
}

/**
 * A deterministic, seeded "waveform" rendered as an SVG path — deterministic
 * so the same track always draws the same shape (mirroring how real waveform
 * displays in DAWs/podcast players are per-file, not random noise each render).
 * The played portion is filled in signal-green; the remainder stays outline.
 */
export function Waveform({ isPlaying, progress, seed = 'default', className }: WaveformProps) {
  const bars = useMemo(() => genBars(seed, 64), [seed]);
  const playedCount = Math.round(bars.length * Math.min(1, Math.max(0, progress)));

  return (
    <div className={cn('flex items-center gap-[2px] h-10 w-full', className)} aria-hidden="true">
      {bars.map((h, i) => {
        const played = i < playedCount;
        return (
          <span
            key={i}
            className={cn(
              'flex-1 rounded-full transition-colors',
              played ? 'bg-signal-500' : 'bg-console-600',
              isPlaying && i === playedCount && 'animate-pulse'
            )}
            style={{ height: `${h * 100}%` }}
          />
        );
      })}
    </div>
  );
}

/** Cheap deterministic pseudo-random bar heights, seeded from a string. */
function genBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const base = 0.15 + (h % 1000) / 1000 * 0.85;
    // Gentle envelope so the ends taper like a real waveform thumbnail.
    const envelope = Math.sin((i / count) * Math.PI) * 0.6 + 0.4;
    bars.push(Math.max(0.08, base * envelope));
  }
  return bars;
}
