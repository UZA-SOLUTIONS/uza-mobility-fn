import { MarketingChrome } from '@/components/marketing/marketing-chrome';
import { getPublicCategories } from '@/lib/api/catalog';
import type { Category } from '@/types/admin/marketplace';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  try {
    categories = await getPublicCategories();
  } catch {
    categories = [];
  }

  return (
    <MarketingChrome categories={categories}>
      <section className="relative overflow-hidden pt-32 pb-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/sourcing-img.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#17443866]" aria-hidden />
        <div className="relative mx-auto w-full max-w-md px-4">{children}</div>
      </section>
    </MarketingChrome>
  );
}
