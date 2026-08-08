import { cn } from '../../lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-console-600 border-t-signal-500',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-3 py-2 animate-pulse">
      <div className="h-10 w-10 rounded bg-console-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/5 rounded bg-console-800" />
        <div className="h-2.5 w-1/4 rounded bg-console-800" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="aspect-square w-full rounded-lg bg-console-800" />
      <div className="h-3 w-4/5 rounded bg-console-800" />
      <div className="h-2.5 w-1/2 rounded bg-console-800" />
    </div>
  );
}

export function FullPageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-3 text-console-400">
      <Spinner className="h-8 w-8" />
      <p className="font-mono text-xs tracking-wide uppercase">{label}</p>
    </div>
  );
}
