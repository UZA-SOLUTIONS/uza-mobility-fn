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
