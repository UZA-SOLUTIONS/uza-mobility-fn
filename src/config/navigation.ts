import { adminRoutes, workspaceRoutes } from '@/config/routes';
import { ElementType } from 'react';
import {
  Home,
  List,
  Users,
  Tag,
  Wrench,
  ShoppingCart,
  CreditCard,
  FileText,
  DollarSign,
  Truck,
  Zap,
  MapPin,
  Megaphone,
  Leaf,
  User,
  Activity,
  Percent,
  Bell,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  /** User must have this permission. */
  permission?: string;
  /** User must have at least one of these permissions. */
  permissions?: string[];
  /** Only visible to super admin (`*` permission). */
  superAdminOnly?: boolean;
  /** Optional icon component to display in sidebars. */
  icon?: ElementType;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export type MarketingFooterColumn = {
  title: string;
  links: NavItem[];
};

/** @deprecated Use buildMarketingNav() with categories from GET /categories */
export const marketingNav: NavItem[] = [
  { label: 'Vehicles', href: '/vehicles' },
  { label: 'Spare Parts', href: '/vehicles' },
  { label: 'For Business', href: '/pricing' },
  { label: 'About UZA Mobility', href: '/about' },
];

/** @deprecated Use buildMarketingFooterColumns() with categories from GET /categories */
export const marketingFooterNav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
];

export const accountNav: NavItem[] = [
  { label: 'Overview', href: workspaceRoutes.account, icon: Home },
  { label: 'Orders', href: workspaceRoutes.accountOrders, icon: ShoppingCart },
  { label: 'Invoices', href: workspaceRoutes.accountInvoices, icon: FileText },
  {
    label: 'Payments',
    href: workspaceRoutes.accountPayments,
    icon: CreditCard,
  },
  {
    label: 'Financing',
    href: workspaceRoutes.accountFinancing,
    icon: DollarSign,
  },
  { label: 'Profile', href: workspaceRoutes.accountProfile, icon: User },
  {
    label: 'Notifications',
    href: workspaceRoutes.accountNotifications,
    icon: Bell,
  },
];

export const buyerNavGroups: NavGroup[] = [
  {
    items: [{ label: 'Overview', href: workspaceRoutes.account, icon: Home }],
  },
  {
    label: 'Purchases',
    items: [
      {
        label: 'Orders',
        href: workspaceRoutes.accountOrders,
        icon: ShoppingCart,
      },
      {
        label: 'Invoices',
        href: workspaceRoutes.accountInvoices,
        icon: FileText,
      },
      {
        label: 'Payments',
        href: workspaceRoutes.accountPayments,
        icon: CreditCard,
      },
      {
        label: 'Financing',
        href: workspaceRoutes.accountFinancing,
        icon: DollarSign,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: workspaceRoutes.accountProfile, icon: User },
      {
        label: 'Notifications',
        href: workspaceRoutes.accountNotifications,
        icon: Bell,
      },
    ],
  },
];

export const sellerNav: NavItem[] = [
  { label: 'Overview', href: workspaceRoutes.seller, icon: Home },
  { label: 'Listings', href: workspaceRoutes.sellerListings, icon: List },
  { label: 'Parts', href: workspaceRoutes.sellerParts, icon: Wrench },
  { label: 'Profile', href: workspaceRoutes.sellerProfile, icon: User },
];

/** Seller sidebar — same structure as admin nav groups. */
export const sellerNavGroups: NavGroup[] = [
  {
    items: [{ label: 'Overview', href: workspaceRoutes.seller, icon: Home }],
  },
  {
    label: 'Marketplace',
    items: [
      { label: 'Listings', href: workspaceRoutes.sellerListings, icon: List },
      { label: 'Parts', href: workspaceRoutes.sellerParts, icon: Wrench },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Profile', href: workspaceRoutes.sellerProfile, icon: User },
      {
        label: 'Notifications',
        href: workspaceRoutes.sellerNotifications,
        icon: Bell,
      },
    ],
  },
  {
    label: 'Buying',
    items: [
      {
        label: 'Buyer workspace',
        href: workspaceRoutes.account,
        icon: ShoppingCart,
      },
    ],
  },
  {
    label: 'Charging',
    items: [
      {
        label: 'Operator workspace',
        href: workspaceRoutes.operator,
        icon: Zap,
      },
    ],
  },
];

export const operatorNavGroups: NavGroup[] = [
  {
    items: [{ label: 'Overview', href: workspaceRoutes.operator, icon: Home }],
  },
  {
    label: 'Stations',
    items: [
      {
        label: 'My stations',
        href: workspaceRoutes.operatorStations,
        icon: MapPin,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Operator profile',
        href: workspaceRoutes.operatorProfile,
        icon: User,
      },
      {
        label: 'Notifications',
        href: workspaceRoutes.operatorNotifications,
        icon: Bell,
      },
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
        icon: Home,
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
        icon: List,
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
        icon: Users,
        permissions: ['sellers:verify', 'sellers:suspend'],
      },
      {
        label: 'Categories',
        href: adminRoutes.categories,
        icon: Tag,
        permissions: ['listings:approve', 'listings:create', 'parts:manage'],
      },
      {
        label: 'Parts',
        href: adminRoutes.parts,
        icon: Wrench,
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
        icon: ShoppingCart,
        permissions: ['orders:read', 'orders:update-status'],
      },
      {
        label: 'Payments',
        href: adminRoutes.payments,
        icon: CreditCard,
        permissions: ['payments:verify', 'payments:reject', 'payments:refund'],
      },
      {
        label: 'Invoices',
        href: adminRoutes.invoices,
        icon: FileText,
        permissions: ['invoices:read', 'invoices:send', 'invoices:cancel'],
      },
      {
        label: 'Financing',
        href: adminRoutes.financing,
        icon: DollarSign,
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
        icon: Truck,
        permissions: ['fleet:read', 'fleet:update-status'],
      },
      {
        label: 'Energy',
        href: adminRoutes.energy,
        icon: Zap,
        permissions: ['parts:manage', 'fleet:read', 'fleet:update-status'],
      },
      {
        label: 'Stations',
        href: adminRoutes.stations,
        icon: MapPin,
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
        icon: Megaphone,
        permissions: ['promotions:create', 'promotions:manage'],
      },
      {
        label: 'Sustainability',
        href: adminRoutes.sustainability,
        icon: Leaf,
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
        icon: Users,
        superAdminOnly: true,
      },
      {
        label: 'Activity logs',
        href: adminRoutes.activityLogs,
        icon: Activity,
        superAdminOnly: true,
      },
      {
        label: 'Pricing rules',
        href: adminRoutes.pricingRules,
        icon: Percent,
        superAdminOnly: true,
      },
      {
        label: 'Profile',
        href: adminRoutes.settings,
        icon: User,
      },
      {
        label: 'Notifications',
        href: adminRoutes.notifications,
        icon: Bell,
      },
    ],
  },
];
