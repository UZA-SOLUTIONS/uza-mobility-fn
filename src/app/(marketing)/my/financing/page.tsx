import { redirect } from 'next/navigation';
import { workspaceRoutes } from '@/config/routes';

export default function MyFinancingPage() {
  redirect(workspaceRoutes.account);
}
