'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buyerNavGroups } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import {
  marketingContainer,
  marketingMintSurface,
} from '@/lib/marketing/layout-classes';
import { cn } from '@/lib/utils';

type MyHubShellProps = {
  children: React.ReactNode;
};

export function MyHubShell({ children }: MyHubShellProps) {
  const pathname = usePathname();
  const navItems = buyerNavGroups.flatMap((group) => group.items);

  return (
    <div
      className={`${marketingMintSurface} flex flex-1 flex-col py-8 sm:py-12`}
    >
      <div className={marketingContainer}>
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium" style={{ color: brand.teal }}>
            My UZA
          </p>
          <h1 className="text-3xl font-semibold text-[#151515]">
            Purchases & account
          </h1>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== workspaceRoutes.account &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-[#174438]'
                    : 'bg-white text-[#356769] hover:bg-white/80',
                )}
                style={
                  active
                    ? { backgroundColor: brand.lime, color: brand.forest }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[#E9E9E9] bg-white p-4 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
