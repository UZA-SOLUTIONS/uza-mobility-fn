/** Horizontal padding for guest/marketing pages — scales down on small screens. */
export const marketingPageX = 'px-4 sm:px-6 md:px-10 lg:px-[60px]' as const;

/** Centered marketing content column with responsive side padding. */
export const marketingContainer =
  `mx-auto w-full max-w-[1440px] ${marketingPageX}` as const;

/** Inner prose blocks (about, blog, for-business). */
export const marketingProseSection =
  `mx-auto max-w-3xl ${marketingPageX} py-12 sm:py-16` as const;

/** Homepage / overlay navbar outer padding. */
export const marketingOverlayNav =
  'px-4 pt-4 sm:px-6 sm:pt-5 md:px-10 lg:px-[60px] lg:pt-[30px]' as const;

/** Footer horizontal padding. */
export const marketingFooterX = 'px-4 sm:px-6 md:px-10 lg:px-20' as const;

/**
 * Brand SVG pattern tiled over marketing surfaces (image: /public/images/SVG.png).
 * Color + image on the same element so the pattern paints above the fill.
 */
const marketingPatternBg = "bg-[url('/images/SVG.png')] bg-repeat" as const;

export const marketingMintSurface =
  `bg-[#f8faf9] ${marketingPatternBg}` as const;

export const marketingWhiteSurface = 'bg-white' as const;

/** Forest-green headers and sections (vehicles hero, promo band, etc.). */
export const marketingForestSurface =
  `bg-[#174438] ${marketingPatternBg}` as const;
