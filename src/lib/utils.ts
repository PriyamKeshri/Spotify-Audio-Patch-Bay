import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Formats milliseconds as m:ss, the standard track-duration display. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Formats a release date (which may be year-only or year-month) for display. */
export function formatReleaseYear(dateStr: string): string {
  return dateStr.slice(0, 4);
}

export function pickImage(images: { url: string; width: number | null }[] | undefined, preferred: 'small' | 'large' = 'large'): string | null {
  if (!images || images.length === 0) return null;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return preferred === 'large' ? sorted[0].url : sorted[sorted.length - 1].url;
}

export function joinArtistNames(artists: { name: string }[] | undefined): string {
  if (!artists || artists.length === 0) return 'Unknown artist';
  return artists.map((a) => a.name).join(', ');
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}
