import { PageHeader } from '@/components/shared/page-header';
import { siteConfig } from '@/config/site';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <PageHeader
        title={`About ${siteConfig.name}`}
        description="Electric mobility marketplace built for Rwanda and the region."
      />
    </div>
  );
}
