import { brand } from '@/lib/marketing/colors';
import { cn } from '@/lib/utils';

type SoldChipProps = {
  className?: string;
  /** Solid fill for photo overlays so the label stays readable. */
  overlay?: boolean;
};

export function SoldChip({ className, overlay = false }: SoldChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        overlay && 'shadow-sm',
        className,
      )}
      style={{
        backgroundColor: overlay ? brand.lime : `${brand.lime}33`,
        color: brand.forest,
      }}
    >
      Sold
    </span>
  );
}
