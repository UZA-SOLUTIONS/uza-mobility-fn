import { redirect } from 'next/navigation';
import { workspaceRoutes } from '@/config/routes';

export default function AccountSettingsRedirectPage() {
  redirect(workspaceRoutes.accountProfile);
}
