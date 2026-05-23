import { AdminAccess } from '@/components/auth/admin-access';
import { Workspace } from '@/components/auth/workspace';
import { adminNav } from '@/config/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAccess>
      <Workspace title="Admin" navItems={adminNav}>
        {children}
      </Workspace>
    </AdminAccess>
  );
}
