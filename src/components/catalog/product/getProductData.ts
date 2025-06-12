import type { ProductVariant } from '@commercetools/platform-sdk';

export type Thumbnail = {
  url: string;
  label: string;
};

export function getAttributeValues(variants: ProductVariant[], name: string): string[] {
  if (!variants?.length) return [];
  const values = variants
    .map(variant => variant.attributes?.find(attribute => attribute.name === name)?.value?.key)
    .filter((key): key is string => key !== undefined);
  return [...new Set(values)];
}
export function getAllVariantImages(variants: ProductVariant[]): Thumbnail[] {
  if (!variants?.length) return [];
  return variants.flatMap(variant =>
    (variant.images ?? []).map(img => ({
      url: img.url,
      label: img.label || `product image`,
    })),
  );
}
export function getLowestPrice(variants: ProductVariant[]): { amount: number; currency: string } {
  if (!variants?.length) return { amount: 0, currency: '' };
  const prices = variants.flatMap(variant => (variant.prices ?? []).map(product => product.value));
  if (!prices.length) return { amount: 0, currency: '' };
  const lowestPrice = prices.reduce(
    (min, price) => (price.centAmount < min.centAmount ? price : min),
    prices[0],
  );
  return { amount: lowestPrice.centAmount, currency: lowestPrice.currencyCode };
}
