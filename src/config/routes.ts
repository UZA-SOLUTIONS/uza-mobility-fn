export const authRoutes = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
} as const;

export const workspaceRoutes = {
  account: '/account',
  accountOrders: '/account/orders',
  accountInvoices: '/account/invoices',
  accountPayments: '/account/payments',
  accountFinancing: '/account/financing',
  accountProfile: '/account/profile',
  /** @deprecated Use accountProfile */
  accountSettings: '/account/profile',
  /** @deprecated Use accountInvoices */
  accountBilling: '/account/invoices',
  seller: '/seller',
  sellerListings: '/seller/listings',
  sellerParts: '/seller/parts',
  sellerProfile: '/seller/profile',
  operator: '/operator',
  operatorStations: '/operator/stations',
  operatorProfile: '/operator/profile',
  admin: '/admin',
} as const;

export const adminRoutes = {
  root: '/admin',
  listings: '/admin/listings',
  categories: '/admin/categories',
  parts: '/admin/parts',
  sellers: '/admin/sellers',
  orders: '/admin/orders',
  payments: '/admin/payments',
  invoices: '/admin/invoices',
  financing: '/admin/financing',
  stations: '/admin/stations',
  fleet: '/admin/fleet',
  energy: '/admin/energy',
  promotions: '/admin/promotions',
  sustainability: '/admin/sustainability',
  users: '/admin/users',
  activityLogs: '/admin/activity-logs',
  pricingRules: '/admin/pricing-rules',
  settings: '/admin/settings',
} as const;

export const publicOnlyAuthPaths = [
  authRoutes.login,
  authRoutes.register,
  authRoutes.forgotPassword,
] as const;

export const protectedWorkspacePrefixes = [
  workspaceRoutes.account,
  workspaceRoutes.seller,
  workspaceRoutes.operator,
  workspaceRoutes.admin,
] as const;
