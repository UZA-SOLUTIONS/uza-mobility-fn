import {
  formatDrivetrainLabel,
  resolveMediaUrl,
} from '@/lib/marketing/listing-display';
import type {
  PublicListing,
  PublicListingPhoto,
} from '@/types/marketplace/public-listing';

export function getListingPhotos(listing: PublicListing): PublicListingPhoto[] {
  const photos = [...(listing.photos ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  if (photos.length > 0) return photos;
  return [];
}

export function formatBodyLabel(listing: PublicListing): string {
  if (listing.subcategory?.name) return listing.subcategory.name;
  if (listing.bodyType) {
    return listing.bodyType
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return listing.category?.name ?? '—';
}

export function formatConditionLabel(condition?: string | null): string {
  if (!condition) return '—';
  if (condition === 'NEW') return 'New';
  return condition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatMileage(listing: PublicListing): string {
  if (listing.mileageKm == null) {
    return listing.isNew ? 'New' : '—';
  }
  return `${Math.round(listing.mileageKm).toLocaleString('en-US')} km`;
}

export function formatBatterySpec(listing: PublicListing): string {
  const kwh = listing.evSpecs?.batteryCapacityKwh;
  if (kwh == null) return '—';
  return `${kwh} kWh Capacity`;
}

export function formatChargingSpec(listing: PublicListing): string {
  const hours = listing.evSpecs?.chargingTimeHours;
  if (hours != null) {
    return `Full charge in ${hours} hrs`;
  }
  if (listing.evSpecs?.fastChargingSupported) {
    return 'DC fast charging supported';
  }
  const type = listing.evSpecs?.chargingType;
  if (type) return type.replace(/_/g, ' ');
  return '—';
}

export function formatTransmissionLabel(): string {
  return 'Automatic';
}

export function formatStockLocation(listing: PublicListing): string {
  if (listing.sellerType === 'UZA_RWANDA_STOCK') {
    return 'Currently in Kigali Stock';
  }
  if (listing.city?.trim()) {
    return `Located in ${listing.city}`;
  }
  if (listing.country === 'RW') {
    return 'Available in Rwanda';
  }
  return 'Available for import to Kigali';
}

export function formatHandoverLine(listing: PublicListing): string {
  const days = listing.deliveryEstimateDays;
  if (days == null) {
    return listing.sellerType === 'UZA_RWANDA_STOCK'
      ? 'Ready for handover in Kigali'
      : 'Delivery timeline confirmed at reservation';
  }
  if (days <= 2) return 'Ready for handover in 1–2 days';
  if (days <= 7) return `Ready for handover in ${days} days`;
  return `Estimated delivery in ${days} days`;
}

export type VehicleSpecRow = {
  label: string;
  value: string;
};

export function buildVehicleSpecRows(listing: PublicListing): VehicleSpecRow[] {
  return [
    { label: 'Body', value: formatBodyLabel(listing) },
    { label: 'Mileage', value: formatMileage(listing) },
    { label: 'Battery', value: formatBatterySpec(listing) },
    { label: 'Year', value: String(listing.manufacturingYear) },
    { label: 'Transmission', value: formatTransmissionLabel() },
    { label: 'Charging', value: formatChargingSpec(listing) },
    {
      label: 'Drive Type',
      value: formatDrivetrainLabel(listing.drivetrain) ?? '—',
    },
    { label: 'Condition', value: formatConditionLabel(listing.condition) },
    {
      label: 'Seats',
      value: listing.seats != null ? String(listing.seats) : '—',
    },
    { label: 'Color', value: listing.color?.trim() || '—' },
  ];
}

export function resolveListingVideoUrl(listing: PublicListing): string | null {
  return resolveMediaUrl(listing.videoUrl ?? null);
}
