import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      <PageHeader
        title="Log in"
        description="Access your buyer, seller, or admin account."
      />
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/forgot-password"
          className="underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
        {' · '}
        <Link href="/register" className="underline-offset-4 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
