import { cn } from '../../lib/utils';

interface VuMeterProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
  variant?: 'signal' | 'tape';
}

/**
 * A CSS-animated bar meter styled after a hardware VU meter. Purely decorative
 * (it does not analyze real audio — the Web Playback SDK / Web Audio API would
 * be required for that, and isn't in scope for a Connect-control client) but
 * it communicates "something is playing" far more distinctively than a spinner.
 */
export function VuMeter({ isPlaying, barCount = 4, className, variant = 'signal' }: VuMeterProps) {
  const color = variant === 'signal' ? 'bg-signal-500' : 'bg-tape-500';
  const delays = ['0ms', '160ms', '80ms', '220ms', '40ms', '190ms'];

  return (
    <div className={cn('flex items-end gap-[3px] h-4', className)} aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-[3px] rounded-sm',
            color,
            isPlaying ? 'animate-vu' : 'opacity-40'
          )}
          style={{
            height: '100%',
            animationDelay: delays[i % delays.length],
            transform: isPlaying ? undefined : 'scaleY(0.3)',
          }}
        />
      ))}
    </div>
  );
}
