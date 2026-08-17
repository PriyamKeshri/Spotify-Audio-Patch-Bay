import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

const DISPLAY_MS = 3500;

/**
 * Mounted once at the app root. Renders a single toast anchored to the
 * viewport coordinates of whatever control last triggered it (see
 * usePlaybackControls().playFromRow), so feedback shows up right next to
 * the row/card the user actually clicked instead of only in the footer.
 */
export function RowToast() {
  const toast = useToastStore((s) => s.toast);
  const dismissToast = useToastStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dismissToast(toast.id), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className="animate-toast-pop panel-brushed pointer-events-none fixed z-50 flex max-w-[240px] -translate-y-[calc(100%+8px)] items-start gap-2 rounded-lg border-signal-500/40 px-3 py-2 text-xs text-console-100 shadow-lg"
      style={{ top: toast.top, left: toast.left }}
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-400" />
      <span>{toast.message}</span>
    </div>
  );
}
