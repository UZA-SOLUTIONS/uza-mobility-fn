import { Suspense } from 'react';
import { VerifyEmailForm } from '@/components/auth/verify-email-form';
import { Spinner } from '@/components/ui/spinner';

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token = '' } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="size-6" />
        </div>
      }
    >
      <VerifyEmailForm token={token} />
    </Suspense>
  );
}
