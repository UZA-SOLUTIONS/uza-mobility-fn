import Link from 'next/link';
import { marketingNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { NavbarAuth } from '@/components/marketing/navbar-auth';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export function MarketingNavbar() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavbarAuth />
        </div>
      </div>
    </header>
  );
}
