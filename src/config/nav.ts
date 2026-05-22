export type NavItem = {
  label: string;
  href: string;
};

export const marketingNav: NavItem[] = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export const marketingFooterNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
];

export const dashboardNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Settings', href: '/settings' },
  { label: 'Billing', href: '/billing' },
];
