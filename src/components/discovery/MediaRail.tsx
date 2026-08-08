import type { ReactNode } from 'react';
import { SkeletonCard } from '../ui/Loading';

interface MediaRailProps {
  title: string;
  eyebrow?: string;
  isLoading?: boolean;
  children: ReactNode;
}

export function MediaRail({ title, eyebrow, isLoading, children }: MediaRailProps) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-3">
        {eyebrow && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-signal-500">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-xl font-semibold text-console-100">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-3">
                <SkeletonCard />
              </div>
            ))
          : children}
      </div>
    </section>
  );
}
