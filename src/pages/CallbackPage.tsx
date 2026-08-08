import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { completeAuthorization } from '../auth/authFlow';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';

export function CallbackPage() {
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setAuthError = useAuthStore((s) => s.setAuthError);
  const [error, setError] = useState<string | null>(null);
  const ranOnce = useRef(false);

  useEffect(() => {
    // Guards against React 18 StrictMode double-invoking effects in dev,
    // which would otherwise try to exchange the same one-time code twice.
    if (ranOnce.current) return;
    ranOnce.current = true;

    const params = new URLSearchParams(window.location.search);
    completeAuthorization(params)
      .then(() => {
        setAuthenticated(true);
        setAuthError(null);
        navigate('/', { replace: true });
      })
      .catch((err: Error) => {
        setError(err.message);
        setAuthError(err.message);
      });
  }, [navigate, setAuthenticated, setAuthError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-console-950 px-6">
      <div className="panel-brushed w-full max-w-sm rounded-2xl p-6 text-center">
        {error ? (
          <>
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-alert-500" />
            <p className="mb-1 font-display text-base text-console-100">Connection failed</p>
            <p className="mb-4 text-xs text-console-400">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/login', { replace: true })}>
              Back to sign in
            </Button>
          </>
        ) : (
          <>
            <Spinner className="mx-auto mb-3 h-6 w-6" />
            <p className="font-mono text-xs uppercase tracking-widest text-console-500">
              Establishing connection…
            </p>
          </>
        )}
      </div>
    </div>
  );
}
