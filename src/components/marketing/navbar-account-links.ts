import { workspaceRoutes } from '@/config/routes';

export const buyerNavbarAccountLinks = [
  { href: workspaceRoutes.account, label: 'Purchases overview' },
  { href: workspaceRoutes.accountWishlist, label: 'Wishlist' },
  { href: workspaceRoutes.accountOrders, label: 'Orders' },
  { href: workspaceRoutes.accountBookings, label: 'Bookings' },
  { href: workspaceRoutes.accountProfile, label: 'Profile' },
] as const;
