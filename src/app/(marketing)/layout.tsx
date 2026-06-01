import { MarketingChrome } from '@/components/marketing/marketing-chrome';
import { getPublicCategories } from '@/lib/api/catalog';
import type { Category } from '@/types/admin/marketplace';

export default async function MarketingLayout({
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

  return <MarketingChrome categories={categories}>{children}</MarketingChrome>;
}
