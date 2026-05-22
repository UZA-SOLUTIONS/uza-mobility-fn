import { StatCards } from '@/components/dashboard/stat-cards';
import { PageHeader } from '@/components/shared/page-header';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your orders, listings, and account activity."
      />
      <StatCards
        stats={[
          { label: 'Active orders', value: '—' },
          { label: 'Saved listings', value: '—' },
          { label: 'Open invoices', value: '—' },
        ]}
      />
    </div>
  );
}
