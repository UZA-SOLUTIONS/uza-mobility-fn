/** Routes with a light (mint/white) background under the floating nav. */
const LIGHT_NAV_PREFIXES = ['/my', '/inquiry'] as const;

/** Use dark nav text/logo on light page backgrounds (nav still floats). */
export function usesLightNavTone(pathname: string): boolean {
  return LIGHT_NAV_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
