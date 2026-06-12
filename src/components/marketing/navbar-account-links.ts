import { workspaceRoutes } from '@/config/routes';

export const buyerNavbarAccountLinks = [
  { href: workspaceRoutes.account, label: 'Purchases overview' },
  { href: workspaceRoutes.accountInvoices, label: 'Invoices' },
  { href: workspaceRoutes.accountPayments, label: 'Payments' },
  { href: workspaceRoutes.accountBookings, label: 'Bookings' },
  { href: workspaceRoutes.accountWishlist, label: 'Wishlist' },
  { href: workspaceRoutes.accountOrders, label: 'Orders' },
  { href: workspaceRoutes.accountProfile, label: 'Profile' },
] as const;
