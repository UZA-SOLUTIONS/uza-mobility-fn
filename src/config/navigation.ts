import { workspaceRoutes } from '@/config/routes';

export type NavItem = {
  label: string;
  href: string;
  permission?: string;
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

export const accountNav: NavItem[] = [
  { label: 'Overview', href: workspaceRoutes.account },
  { label: 'Settings', href: workspaceRoutes.accountSettings },
  { label: 'Billing', href: workspaceRoutes.accountBilling },
];

export const sellerNav: NavItem[] = [
  { label: 'Overview', href: workspaceRoutes.seller },
];

export const adminNav: NavItem[] = [
  { label: 'Overview', href: workspaceRoutes.admin },
];
