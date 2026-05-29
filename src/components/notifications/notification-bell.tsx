'use client';

import { useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/admin/format';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from '@/queries/notifications';

export function NotificationBell() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [open, setOpen] = useState(false);
  const unread = useUnreadNotificationCount();
  const list = useNotifications({ page: 1, limit: 20 }, open);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = unread.data?.unreadCount ?? 0;
  const items = useMemo(() => {
    const rows = list.data?.items ?? [];
    if (!currentUserId) return rows;
    return rows.filter((item) => item.userId === currentUserId);
  }, [list.data?.items, currentUserId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : 'Notifications'
          }
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              disabled={markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              Mark all read
            </Button>
          ) : null}
        </div>

        <ScrollArea className="max-h-[min(24rem,70vh)]">
          {list.isLoading ? (
            <div className="space-y-2 p-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : null}

          {list.isError ? (
            <p className="p-4 text-sm text-destructive">
              Could not load notifications.
            </p>
          ) : null}

          {!list.isLoading && items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : null}

          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={cn(
                    'w-full px-4 py-3 text-left transition-colors hover:bg-muted/50',
                    !item.isRead && 'bg-primary/5',
                  )}
                  onClick={() => {
                    if (!item.isRead) {
                      markRead.mutate(item.id);
                    }
                  }}
                >
                  <p className="text-sm leading-snug font-medium">
                    {item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {item.body}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
