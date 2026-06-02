import { VehicleDetailPageAsync } from '@/components/marketing/vehicle-detail-page-async';

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VehicleDetailPage({
  params,
}: VehicleDetailPageProps) {
  const { slug } = await params;
  return <VehicleDetailPageAsync slug={slug} />;
}
