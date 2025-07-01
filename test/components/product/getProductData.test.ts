import { expect, it, describe } from 'vitest';
import {
  getAttributeValues,
  getAttributeValue,
  getVariantIdByAttributes,
  getAllVariantImages,
  getLowestPrice,
} from '../../../src/components/catalog/product/getProductData';
import { VARIANTS } from '../../../src/interfaces/types';
import { ProductVariant } from '@commercetools/platform-sdk';

const variant1: ProductVariant = {
  id: 1,
  attributes: [
    { name: VARIANTS.brand, value: { key: 'brand1', label: '' } },
    { name: VARIANTS.color, value: { key: 'color1', label: '' } },
    { name: VARIANTS.size, value: { key: 'size1', label: '' } },
  ],
  images: [
    { url: 'url1', label: 'label1', dimensions: { w: 1, h: 1 } },
    { url: 'url1.1', label: 'label1.1', dimensions: { w: 1, h: 1 } },
  ],
  prices: [
    {
      id: '',
      value: { centAmount: 1, currencyCode: '1', type: 'centPrecision', fractionDigits: 1 },
    },
    {
      id: '',
      value: { centAmount: 2, currencyCode: '1', type: 'centPrecision', fractionDigits: 1 },
    },
  ],
};
const variant2: ProductVariant = {
  id: 2,
  attributes: [
    { name: VARIANTS.brand, value: { key: 'brand2', label: '' } },
    { name: VARIANTS.color, value: { key: 'color2', label: '' } },
    { name: VARIANTS.size, value: { key: 'size2', label: '' } },
  ],
  images: [
    { url: 'url2', label: 'label2', dimensions: { w: 1, h: 1 } },
    { url: 'url2.1', label: '', dimensions: { w: 1, h: 1 } },
  ],
  prices: [
    {
      id: '',
      value: { centAmount: 3, currencyCode: '2', type: 'centPrecision', fractionDigits: 1 },
    },
    {
      id: '',
      value: { centAmount: 4, currencyCode: '2', type: 'centPrecision', fractionDigits: 1 },
    },
  ],
};
const variant3: ProductVariant = { id: 3, prices: [] };

const variants = [variant1, variant2];

describe('get Product data tests', () => {
  it('should return attributes values', () => {
    expect(getAttributeValues(variants, VARIANTS.color)).toStrictEqual(['color1', 'color2']);
    expect(getAttributeValues([], VARIANTS.color)).toStrictEqual([]);
    expect(getAttributeValues(variants, VARIANTS.size)).toStrictEqual(['size1', 'size2']);
    expect(getAttributeValue(variant1, VARIANTS.color)).toBe('color1');
    expect(getVariantIdByAttributes(variants, { size: 'size1', color: 'color1' })).toBe(1);
    expect(getVariantIdByAttributes(variants, { size: 'size2', color: 'color1' })).toBeUndefined();
    expect(getAllVariantImages(variants)).toStrictEqual([
      { url: 'url1', label: 'label1' },
      { url: 'url1.1', label: 'label1.1' },
      { url: 'url2', label: 'label2' },
      { url: 'url2.1', label: 'product image' },
    ]);
    expect(getAllVariantImages([])).toStrictEqual([]);
    expect(getAllVariantImages([variant3])).toStrictEqual([]);
    expect(getLowestPrice(variants)).toStrictEqual({
      amount: 1,
      currency: '1',
    });
    expect(getLowestPrice([])).toStrictEqual({
      amount: 0,
      currency: '',
    });
    expect(getLowestPrice([variant3])).toStrictEqual({
      amount: 0,
      currency: '',
    });
    expect(getLowestPrice([{ id: 4 }])).toStrictEqual({
      amount: 0,
      currency: '',
    });
  });
});
