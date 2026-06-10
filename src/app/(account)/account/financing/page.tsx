import { redirect } from 'next/navigation';
import { workspaceRoutes } from '@/config/routes';

export default function AccountFinancingPage() {
  redirect(workspaceRoutes.account);
}
