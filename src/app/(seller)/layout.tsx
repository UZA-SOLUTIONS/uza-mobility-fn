import { SellerAccess } from '@/components/auth/seller-access';
import { Workspace } from '@/components/auth/workspace';
import { sellerNav } from '@/config/navigation';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerAccess>
      <Workspace title="Seller workspace" navItems={sellerNav}>
        {children}
      </Workspace>
    </SellerAccess>
  );
}
