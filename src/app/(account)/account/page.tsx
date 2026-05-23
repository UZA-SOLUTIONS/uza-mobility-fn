import { StatCards } from '@/components/dashboard/stat-cards';
import { PageHeader } from '@/components/shared/page-header';

export default function AccountOverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Account"
        description="Your orders, invoices, and buyer activity."
      />
      <StatCards
        stats={[
          { label: 'Active orders', value: '—' },
          { label: 'Open invoices', value: '—' },
          { label: 'Financing requests', value: '—' },
        ]}
      />
    </div>
  );
}
