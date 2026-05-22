import NextAuth from 'next-auth';

/**
 * NextAuth v5 scaffold — wire Credentials provider to Uza `/auth/login` when ready.
 * @see src/app/api/auth/[...nextauth]/route.ts
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
});
