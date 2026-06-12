import { CheckEmailForm } from '@/components/auth/check-email-form';

type CheckEmailPageProps = {
  searchParams: Promise<{ email?: string; callbackUrl?: string }>;
};

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const { email = '', callbackUrl = '' } = await searchParams;

  return (
    <CheckEmailForm
      email={email}
      callbackUrl={callbackUrl.startsWith('/') ? callbackUrl : undefined}
    />
  );
}
