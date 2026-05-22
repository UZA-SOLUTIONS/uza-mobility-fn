import { PageHeader } from '@/components/shared/page-header';

type OrgPageProps = {
  params: Promise<{ orgSlug: string }>;
};

export default async function OrgWorkspacePage({ params }: OrgPageProps) {
  const { orgSlug } = await params;

  return (
    <PageHeader
      title={orgSlug}
      description="Organization workspace — map this slug to seller, fleet, or admin context as needed."
    />
  );
}
