'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { authRoutes } from '@/config/routes';
import {
  clearSessionUpdate,
  setSessionUpdate,
} from '@/lib/auth/session-update';

/**
 * Keeps the NextAuth JWT fresh (backend access token ~15m).
 * `SessionProvider` has refetchOnWindowFocus disabled — this component is the
 * only place that should call `session.update()` on a schedule / window focus.
 */
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

export function SessionRefresh() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    setSessionUpdate(update);
    return () => clearSessionUpdate();
  }, [update]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    if (session?.error === 'RefreshAccessTokenError') {
      void signOut({ callbackUrl: authRoutes.login });
      return;
    }

    const interval = window.setInterval(() => {
      void update();
    }, REFRESH_INTERVAL_MS);

    const onFocus = () => {
      if (session?.error) return;
      void update();
    };

    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [session?.error, status, update]);

  return null;
}
