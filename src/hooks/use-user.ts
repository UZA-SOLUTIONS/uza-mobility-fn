'use client';

/**
 * Placeholder — connect to session / API user profile when auth is wired.
 */
export function useUser() {
  return {
    user: null as { id: string; email: string; roles: string[] } | null,
    isLoading: false,
    isAuthenticated: false,
  };
}
