import {
  authenticatedFetch,
  authenticatedPaginatedFetch,
} from '@/lib/api/authenticated';
import { toSearchParams } from '@/lib/api/query-params';
import type {
  AppNotification,
  NotificationsFilters,
} from '@/types/notifications';

export function getNotifications(filters: NotificationsFilters = {}) {
  return authenticatedPaginatedFetch<AppNotification>('/notifications', {
    searchParams: toSearchParams({
      ...filters,
      unreadOnly: filters.unreadOnly ? 'true' : undefined,
    }),
  });
}

export function getUnreadNotificationCount() {
  return authenticatedFetch<{ unreadCount: number }>(
    '/notifications/unread-count',
  );
}

export function markNotificationRead(id: string) {
  return authenticatedFetch<AppNotification>(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export function markAllNotificationsRead() {
  return authenticatedFetch<{ markedCount: number }>(
    '/notifications/read-all',
    { method: 'PATCH' },
  );
}
