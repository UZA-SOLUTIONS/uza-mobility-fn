'use client';

import Link from 'next/link';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';

type InquirySuccessActionsProps = {
  email: string;
  registerHref: string;
};

export function InquirySuccessActions({
  email,
  registerHref,
}: InquirySuccessActionsProps) {
  return (
    <div className="space-y-4">
      <GoogleSignInButton returnTo={workspaceRoutes.account} />

      <div className="flex flex-col gap-2 pt-2">
        <Button
          asChild
          className="h-10 rounded-full"
          style={{ backgroundColor: brand.forest }}
        >
          <Link href={registerHref}>
            {email ? 'Create account with email' : 'Create account'}
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-10 rounded-full">
          <Link href={authRoutes.login}>Sign in with email</Link>
        </Button>
      </div>
    </div>
  );
}
