'use client';

import {
  startGoogleSignIn,
  isGoogleSignInEnabled,
} from '@/lib/auth/google-sign-in';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/auth/google-icon';

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
    <Button
      type="button"
      variant="outline"
      className="h-10 w-full rounded-full border border-[#E9E9E9]/80 bg-white text-sm font-normal text-[#151515] hover:bg-[#fafafa]"
      disabled={disabled}
      onClick={() => {
        try {
          startGoogleSignIn(returnTo);
        } catch {
          onError?.('Unable to start Google sign-in. Please try again.');
        }
      }}
    >
      <GoogleIcon className="size-5" />
      Continue with Google
    </Button>
  );
}
