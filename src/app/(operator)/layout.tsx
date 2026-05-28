import { OperatorShell } from '@/components/operator/shell';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OperatorShell>{children}</OperatorShell>;
}
