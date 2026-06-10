'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { NavItem } from '@/config/navigation';
import { authRoutes } from '@/config/routes';
import { MarketingNavLink } from '@/components/marketing/marketing-nav-link';
import { NavbarCart } from '@/components/marketing/navbar-cart';
import { NavbarAuth } from '@/components/marketing/navbar-auth';
import { NavbarMobileMenu } from '@/components/marketing/navbar-mobile-menu';
import { brand } from '@/lib/marketing/colors';
import { marketingOverlayNav } from '@/lib/marketing/layout-classes';

type MarketingNavbarProps = {
  /**
   * Light text/logo for dark heroes. When false the bar still floats, but uses
   * dark text for readability on mint/white page backgrounds.
   */
  overlay?: boolean;
  navItems: NavItem[];
};

export function MarketingNavbar({
  overlay = true,
  navItems,
}: MarketingNavbarProps) {
  return (
    <header className={`absolute inset-x-0 top-0 z-20 ${marketingOverlayNav}`}>
      <div
        className="mx-auto flex max-w-[1320px] items-center justify-between rounded-lg px-6 py-4 backdrop-blur-[56px]"
        style={{
          background: overlay
            ? 'linear-gradient(135deg, rgba(254, 248, 255, 0.21) 0%, rgba(254, 248, 255, 0) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.55) 100%)',
        }}
      >
        <Link href="/" className="relative block h-[53px] w-[118px] shrink-0">
          <Image
            src={
              overlay
                ? '/images/FInal-logo.png'
                : '/images/FInal-logo-dashboard.png'
            }
            alt="UZA Mobility"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <MarketingNavLink
              key={item.label}
              item={item}
              overlay={overlay}
              variant="desktop"
            />
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <NavbarMobileMenu navItems={navItems} overlay={overlay} />
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
