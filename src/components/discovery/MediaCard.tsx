import { Play } from 'lucide-react';
import type { MouseEvent } from 'react';
import { cn, pickImage } from '../../lib/utils';

interface MediaCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string | null;
  circular?: boolean;
  onPlay?: (e: MouseEvent<HTMLButtonElement>) => void;
  onClick?: () => void;
}

export function MediaCard({ title, subtitle, imageUrl, circular, onPlay, onClick }: MediaCardProps) {
  return (
    <div
      className="group relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-console-800"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative">
        <div
          className={cn(
            'aspect-square w-full overflow-hidden bg-console-800',
            circular ? 'rounded-full' : 'rounded-md'
          )}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-console-600">♪</div>
          )}
        </div>
        {onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(e);
            }}
            aria-label={`Play ${title}`}
            className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-signal-500 text-console-950 opacity-0 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-signal-400 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Play className="h-4 w-4 fill-current" />
          </button>
        )}
      </div>
      <p className="mt-3 truncate text-sm font-medium text-console-100">{title}</p>
      {subtitle && <p className="mt-0.5 truncate text-xs text-console-400">{subtitle}</p>}
    </div>
  );
}

export function mediaCardImage(images: { url: string; width: number | null }[] | undefined) {
  return pickImage(images, 'large');
}
