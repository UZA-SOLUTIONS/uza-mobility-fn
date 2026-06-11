/** Canonical email form for auth API requests (matches backend normalization). */
export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}
