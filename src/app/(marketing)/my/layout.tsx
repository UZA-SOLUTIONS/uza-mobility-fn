import { BuyerAccess } from '@/components/auth/buyer-access';
import { MyHubShell } from '@/components/buyer/my-hub-shell';

export default function MyHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BuyerAccess>
      <MyHubShell>{children}</MyHubShell>
    </BuyerAccess>
  );
}
