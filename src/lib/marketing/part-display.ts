import type { PublicPart } from '@/types/marketplace/public-part';

export function partCompatibilityLabel(part: PublicPart): string | null {
  const brands = part.compatibleBrands ?? [];
  const models = part.compatibleModels ?? [];

  if (brands.length === 0 && models.length === 0) {
    return null;
  }

  if (brands.length > 0 && models.length > 0) {
    const fits = brands.map((brand, index) => {
      const model = models[index] ?? models[0];
      return model ? `${brand} ${model}` : brand;
    });
    return `Fits ${fits.join(', ')}`;
  }

  if (brands.length > 0) {
    return `Fits ${brands.join(', ')}`;
  }

  return `Fits ${models.join(', ')}`;
}
