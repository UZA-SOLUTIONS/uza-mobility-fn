export const authRoutes = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
} as const;

export const workspaceRoutes = {
  account: '/account',
  accountSettings: '/account/settings',
  accountBilling: '/account/billing',
  seller: '/seller',
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
  fleet: '/admin/fleet',
  promotions: '/admin/promotions',
  sustainability: '/admin/sustainability',
  users: '/admin/users',
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
  workspaceRoutes.admin,
] as const;
