import Link from 'next/link';
import { marketingFooterNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';

export function MarketingFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav className="flex flex-wrap gap-4 text-sm">
          {marketingFooterNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
