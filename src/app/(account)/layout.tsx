import { Workspace } from '@/components/auth/workspace';
import { accountNav } from '@/config/navigation';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Workspace title="Account" navItems={accountNav}>
      {children}
    </Workspace>
  );
}
