'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { NavItem } from '@/config/navigation';
import { authRoutes } from '@/config/routes';
import { NavbarCart } from '@/components/marketing/navbar-cart';
import { NavbarAuth } from '@/components/marketing/navbar-auth';
import { brand } from '@/lib/marketing/colors';

type MarketingNavbarProps = {
  /** Transparent glass bar over the hero (homepage). */
  overlay?: boolean;
  navItems: NavItem[];
};

export function MarketingNavbar({
  overlay = false,
  navItems,
}: MarketingNavbarProps) {
  return (
    <header
      className={
        overlay
          ? 'absolute inset-x-0 top-0 z-20 px-[60px] pt-[30px]'
          : 'border-b bg-background'
      }
    >
      <div
        className={
          overlay
            ? 'mx-auto flex max-w-[1320px] items-center justify-between rounded-lg px-6 py-4 backdrop-blur-[56px]'
            : 'mx-auto flex h-16 max-w-6xl items-center justify-between px-4'
        }
        style={
          overlay
            ? {
                background:
                  'linear-gradient(135deg, rgba(254, 248, 255, 0.21) 0%, rgba(254, 248, 255, 0) 100%)',
              }
            : undefined
        }
      >
        <Link href="/" className="relative block h-[53px] w-[118px] shrink-0">
          <Image
            src="/images/FInal-logo.png"
            alt="UZA Mobility"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-5 py-2 text-sm ${
                overlay ? 'text-white' : 'text-primary/80 hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <NavbarCart overlay={overlay} />
          <Link
            href="/vehicles"
            className={`flex items-center justify-center px-5 py-3 ${
              overlay ? 'text-white' : 'text-primary'
            }`}
            aria-label="Search vehicles"
          >
            <Search className="size-5" />
          </Link>
          <div className="hidden sm:block">
            <NavbarAuth overlay={overlay} />
          </div>
          <div className="sm:hidden">
            <Link
              href={authRoutes.login}
              className="px-3 py-2 text-sm font-medium"
              style={{ color: overlay ? brand.lime : brand.forest }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
