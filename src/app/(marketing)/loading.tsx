/** Generic fallback — avoid flashing the homepage skeleton on other routes. */
export default function MarketingLoading() {
  return (
    <div
      className="min-h-[40vh] bg-white"
      aria-busy
      aria-label="Loading page"
    />
  );
}
