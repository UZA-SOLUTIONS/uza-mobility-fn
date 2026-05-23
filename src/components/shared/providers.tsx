'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { SessionRefresh } from '@/components/auth/session';
import { QueryProvider } from '@/lib/query/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <SessionRefresh />
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
