'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { authRoutes } from '@/config/routes';
import { authRedirect } from '@/lib/auth/redirect';
import { isMeUser } from '@/types/auth/me-user';

export function NavbarAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-8 w-24" />;
  }

  if (isMeUser(session?.user)) {
    const workspaceHref = authRedirect(session.user);
    return (
      <Button size="sm" asChild>
        <Link href={workspaceHref}>Go to workspace</Link>
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href={authRoutes.login}>Log in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href={authRoutes.register}>Get started</Link>
      </Button>
    </>
  );
}
