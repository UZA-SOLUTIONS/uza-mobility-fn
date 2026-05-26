'use client';

import Link from 'next/link';
import { usePermissions } from '@/hooks/permissions';
import { Button } from '@/components/ui/button';

type SellerAccessProps = {
  children: React.ReactNode;
};

export function SellerAccess({ children }: SellerAccessProps) {
  const { hasSellerWorkspace, isLoading, user } = usePermissions();

  if (isLoading && !user) {
    return null;
  }

  if (!hasSellerWorkspace) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background p-6">
        <div className="mx-auto max-w-lg space-y-4 rounded-lg border bg-card p-6">
          <h1 className="text-lg font-semibold">Seller access required</h1>
          <p className="text-sm text-muted-foreground">
            Complete seller onboarding to use this workspace.
          </p>
          <Button asChild variant="outline">
            <Link href="/account">Back to account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
