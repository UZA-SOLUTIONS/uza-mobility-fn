import { workspaceRoutes } from '@/config/routes';

/** Notifications page for the workspace implied by the current path. */
export function notificationsHrefFromPathname(pathname: string): string {
  if (pathname.startsWith(workspaceRoutes.seller)) {
    return workspaceRoutes.sellerNotifications;
  }
  if (pathname.startsWith(workspaceRoutes.operator)) {
    return workspaceRoutes.operatorNotifications;
  }
  return workspaceRoutes.accountNotifications;
}

/** Notifications page under a workspace root (e.g. `/admin` → `/admin/notifications`). */
export function notificationsHrefForWorkspaceRoot(workspaceRoot: string) {
  return `${workspaceRoot}/notifications`;
}
