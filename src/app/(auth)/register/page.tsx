import { Suspense } from 'react';
import { Register } from '@/components/auth/register';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Spinner className="size-6" />
        </div>
      }
    >
      <Register />
    </Suspense>
  );
}
