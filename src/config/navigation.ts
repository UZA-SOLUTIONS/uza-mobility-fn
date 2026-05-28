import { adminRoutes, workspaceRoutes } from '@/config/routes';

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
  { label: 'Overview', href: workspaceRoutes.account },
  { label: 'Orders', href: workspaceRoutes.accountOrders },
  { label: 'Invoices', href: workspaceRoutes.accountInvoices },
  { label: 'Payments', href: workspaceRoutes.accountPayments },
  { label: 'Financing', href: workspaceRoutes.accountFinancing },
  { label: 'Profile', href: workspaceRoutes.accountProfile },
];

export const buyerNavGroups: NavGroup[] = [
  {
    items: [{ label: 'Overview', href: workspaceRoutes.account }],
  },
  {
    label: 'Purchases',
    items: [
      { label: 'Orders', href: workspaceRoutes.accountOrders },
      { label: 'Invoices', href: workspaceRoutes.accountInvoices },
      { label: 'Payments', href: workspaceRoutes.accountPayments },
      { label: 'Financing', href: workspaceRoutes.accountFinancing },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Profile', href: workspaceRoutes.accountProfile }],
  },
];

export const sellerNav: NavItem[] = [
  { label: 'Overview', href: workspaceRoutes.seller },
  { label: 'Listings', href: workspaceRoutes.sellerListings },
  { label: 'Parts', href: workspaceRoutes.sellerParts },
  { label: 'Profile', href: workspaceRoutes.sellerProfile },
];

/** Seller sidebar — same structure as admin nav groups. */
export const sellerNavGroups: NavGroup[] = [
  {
    items: [{ label: 'Overview', href: workspaceRoutes.seller }],
  },
  {
    label: 'Marketplace',
    items: [
      { label: 'Listings', href: workspaceRoutes.sellerListings },
      { label: 'Parts', href: workspaceRoutes.sellerParts },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Profile', href: workspaceRoutes.sellerProfile }],
  },
  {
    label: 'Buying',
    items: [{ label: 'Buyer workspace', href: workspaceRoutes.account }],
  },
  {
    label: 'Charging',
    items: [{ label: 'Operator workspace', href: workspaceRoutes.operator }],
  },
];

export const operatorNavGroups: NavGroup[] = [
  {
    items: [{ label: 'Overview', href: workspaceRoutes.operator }],
  },
  {
    label: 'Stations',
    items: [{ label: 'My stations', href: workspaceRoutes.operatorStations }],
  },
  {
    label: 'Account',
    items: [
      { label: 'Operator profile', href: workspaceRoutes.operatorProfile },
    ],
  },
];

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
        label: 'Stations',
        href: adminRoutes.stations,
        permissions: [
          'stations:read-all',
          'stations:approve',
          'stations:reject',
          'stations:suspend',
        ],
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
