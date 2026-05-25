'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSessionUser } from '@/hooks/session-user';
import { useLogout } from '@/queries/auth';
import type { NavItem } from '@/config/navigation';

type WorkspaceProps = {
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
};

export function Workspace({ title, navItems, children }: WorkspaceProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const { user } = useSessionUser();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : null;
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?';

  return (
    <div className="flex min-h-full">
      <aside className="flex w-56 flex-col border-r bg-muted/30 p-4">
        <Link href="/" className="mb-2 font-semibold">
          {siteConfig.name}
        </Link>
        <p className="mb-6 text-xs text-muted-foreground">{title}</p>
        <nav className="flex flex-col gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 transition-colors',
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? 'bg-background font-medium shadow-sm'
                  : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-3 border-b px-4">
          {displayName ? (
            <div className="mr-auto flex items-center gap-2 text-sm">
              <Avatar size="sm">
                {user?.profilePhoto ? (
                  <AvatarImage src={user.profilePhoto} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden font-medium sm:inline">
                {displayName}
              </span>
            </div>
          ) : null}
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            Log out
          </Button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
