import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  PENDING: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  APPROVED: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  PUBLISHED: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  ACTIVE: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  REJECTED: 'bg-red-500/15 text-red-700 dark:text-red-400',
  SUSPENDED: 'bg-red-500/15 text-red-700 dark:text-red-400',
  DRAFT: 'bg-muted text-muted-foreground',
  SOLD: 'bg-muted text-muted-foreground',
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replaceAll('_', ' ');

  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-normal capitalize',
        statusStyles[status] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {label}
    </Badge>
  );
}
