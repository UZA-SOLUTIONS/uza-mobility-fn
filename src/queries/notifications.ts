'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { ApiClientError } from '@/lib/api';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/api/notifications';
import type { NotificationsFilters } from '@/types/notifications';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filters: NotificationsFilters) =>
    [...notificationKeys.all, 'list', filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

function toastError(error: unknown, fallback: string) {
  toast.error(error instanceof ApiClientError ? error.message : fallback);
}

export function useUnreadNotificationCount(enabled = true) {
  const { status } = useSession();
  const authed = status === 'authenticated' && enabled;

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    enabled: authed,
    // Fallback if WebSocket is unavailable; realtime updates use NotificationSocketListener.
    refetchInterval: authed ? 60_000 : false,
    refetchOnWindowFocus: true,
  });
}

export function useNotifications(
  filters: NotificationsFilters,
  enabled = true,
) {
  const { status } = useSession();

  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => getNotifications(filters),
    enabled: status === 'authenticated' && enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => toastError(error, 'Failed to mark notification read'),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      toast.success('All notifications marked as read');
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) =>
      toastError(error, 'Failed to mark notifications as read'),
  });
}
