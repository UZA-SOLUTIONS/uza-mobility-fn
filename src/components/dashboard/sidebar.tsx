'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dashboardNav } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r bg-muted/30 p-4">
      <Link href="/dashboard" className="mb-8 font-semibold">
        {siteConfig.name}
      </Link>
      <nav className="flex flex-col gap-1 text-sm">
        {dashboardNav.map((item) => (
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
  );
}
