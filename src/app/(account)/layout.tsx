import { BuyerAccess } from '@/components/auth/buyer-access';
import { BuyerShell } from '@/components/buyer/shell';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BuyerAccess>
      <BuyerShell>{children}</BuyerShell>
    </BuyerAccess>
  );
}
