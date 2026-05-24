'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/config/site';
import { useAdminNav } from '@/hooks/admin-nav';
import { usePermissions } from '@/hooks/permissions';
import { useLogout } from '@/queries/auth';
import { cn } from '@/lib/utils';

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const { groups, isLoading: navLoading } = useAdminNav();
  const { user } = usePermissions();

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-background">
      <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-muted/30 lg:w-64">
        <div className="shrink-0 border-b px-4 py-4">
          <Link href="/" className="block font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <nav className="flex flex-col gap-5 p-3">
            {navLoading ? (
              <div className="space-y-2 px-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.label ?? 'main'}>
                  {group.label ? (
                    <p className="mb-1.5 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {group.label}
                    </p>
                  ) : null}
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/admin' &&
                          pathname.startsWith(`${item.href}/`));

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              'block rounded-md px-2.5 py-2 text-sm transition-colors',
                              isActive
                                ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-foreground/10'
                                : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </nav>
        </ScrollArea>

        {user ? (
          <div className="shrink-0 border-t px-4 py-3">
            <p className="truncate text-xs font-medium">{user.email}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.roles.join(', ')}
            </p>
          </div>
        ) : null}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b px-4 lg:px-6">
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
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
