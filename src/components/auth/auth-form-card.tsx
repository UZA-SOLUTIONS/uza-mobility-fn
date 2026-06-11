import type { ReactNode } from 'react';

type AuthFormCardProps = {
  children: ReactNode;
};

export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <div className="auth-surface w-full rounded-2xl border border-[#E9E9E9] bg-white p-4 sm:p-5">
      {children}
    </div>
  );
}
