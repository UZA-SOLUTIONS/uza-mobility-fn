import { SellerAccess } from '@/components/auth/seller-access';
import { SellerShell } from '@/components/seller/shell';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerAccess>
      <SellerShell>{children}</SellerShell>
    </SellerAccess>
  );
}
