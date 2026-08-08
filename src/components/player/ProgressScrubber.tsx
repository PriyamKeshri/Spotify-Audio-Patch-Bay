import { useRef, useState } from 'react';
import { formatDuration } from '../../lib/utils';

interface ProgressScrubberProps {
  progressMs: number;
  durationMs: number;
  onSeek: (positionMs: number) => void;
  disabled?: boolean;
}

export function ProgressScrubber({ progressMs, durationMs, onSeek, disabled }: ProgressScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const ratio = dragRatio ?? (durationMs > 0 ? Math.min(1, progressMs / durationMs) : 0);

  const ratioFromEvent = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragRatio(ratioFromEvent(e.clientX));
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragRatio === null || disabled) return;
    setDragRatio(ratioFromEvent(e.clientX));
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRatio === null || disabled) return;
    onSeek(dragRatio * durationMs);
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDragRatio(null);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 text-right font-mono text-[11px] text-console-500">
        {formatDuration(dragRatio !== null ? dragRatio * durationMs : progressMs)}
      </span>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="group relative h-4 flex-1 cursor-pointer touch-none"
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={durationMs}
        aria-valuenow={progressMs}
      >
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-console-700" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-console-200 group-hover:bg-signal-500"
          style={{ width: `${ratio * 100}%` }}
        />
        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-console-100 opacity-0 shadow group-hover:opacity-100"
          style={{ left: `${ratio * 100}%` }}
        />
      </div>
      <span className="w-10 font-mono text-[11px] text-console-500">{formatDuration(durationMs)}</span>
    </div>
  );
}
