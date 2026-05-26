import { adminRoutes } from '@/config/routes';

export type NavItem = {
  label: string;
  href: string;
  /** User must have this permission. */
  permission?: string;
  /** User must have at least one of these permissions. */
  permissions?: string[];
  /** Only visible to super admin (`*` permission). */
  superAdminOnly?: boolean;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
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
  { label: 'Overview', href: '/account' },
  { label: 'Settings', href: '/account/settings' },
  { label: 'Billing', href: '/account/billing' },
];

export const sellerNav: NavItem[] = [{ label: 'Overview', href: '/seller' }];

/** Full admin sidebar; filter with `useAdminNav()`. */
export const adminNavGroups: NavGroup[] = [
  {
    items: [
      {
        label: 'Overview',
        href: adminRoutes.root,
        superAdminOnly: true,
      },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      {
        label: 'Listings',
        href: adminRoutes.listings,
        permissions: [
          'listings:approve',
          'listings:reject',
          'listings:delete',
          'listings:create',
          'listings:feature',
        ],
      },
      {
        label: 'Sellers',
        href: adminRoutes.sellers,
        permissions: ['sellers:verify', 'sellers:suspend'],
      },
      {
        label: 'Categories',
        href: adminRoutes.categories,
        permissions: ['listings:approve', 'listings:create', 'parts:manage'],
      },
      {
        label: 'Parts',
        href: adminRoutes.parts,
        permissions: ['parts:manage'],
      },
    ],
  },
  {
    label: 'Commerce',
    items: [
      {
        label: 'Orders',
        href: adminRoutes.orders,
        permissions: ['orders:read', 'orders:update-status'],
      },
      {
        label: 'Payments',
        href: adminRoutes.payments,
        permissions: ['payments:verify', 'payments:reject', 'payments:refund'],
      },
      {
        label: 'Invoices',
        href: adminRoutes.invoices,
        permissions: ['invoices:read', 'invoices:send', 'invoices:cancel'],
      },
      {
        label: 'Financing',
        href: adminRoutes.financing,
        permissions: ['financing:read', 'financing:send-to-bank'],
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        label: 'Fleet',
        href: adminRoutes.fleet,
        permissions: ['fleet:read', 'fleet:update-status'],
      },
      {
        label: 'Energy',
        href: adminRoutes.energy,
        permissions: ['parts:manage', 'fleet:read', 'fleet:update-status'],
      },
      {
        label: 'Promotions',
        href: adminRoutes.promotions,
        permissions: ['promotions:create', 'promotions:manage'],
      },
      {
        label: 'Sustainability',
        href: adminRoutes.sustainability,
        permissions: ['sustainability:read', 'sustainability:manage'],
      },
    ],
  },
  {
    label: 'Platform',
    items: [
      {
        label: 'Users',
        href: adminRoutes.users,
        superAdminOnly: true,
      },
      {
        label: 'Activity logs',
        href: adminRoutes.activityLogs,
        superAdminOnly: true,
      },
      {
        label: 'Pricing rules',
        href: adminRoutes.pricingRules,
        superAdminOnly: true,
      },
      {
        label: 'Profile',
        href: adminRoutes.settings,
      },
    ],
  },
];
