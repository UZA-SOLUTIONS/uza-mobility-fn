'use client';

import {
  startGoogleSignIn,
  isGoogleSignInEnabled,
} from '@/lib/auth/google-sign-in';
import { Button } from '@/components/ui/button';

type GoogleSignInButtonProps = {
  returnTo?: string;
  onError?: (message: string) => void;
  disabled?: boolean;
};

export function GoogleSignInButton({
  returnTo,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  if (!isGoogleSignInEnabled()) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs tracking-wide uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-10 w-full rounded-full"
        disabled={disabled}
        onClick={() => {
          try {
            startGoogleSignIn(returnTo);
          } catch {
            onError?.('Unable to start Google sign-in. Please try again.');
          }
        }}
      >
        Continue with Google
      </Button>
    </div>
  );
}
