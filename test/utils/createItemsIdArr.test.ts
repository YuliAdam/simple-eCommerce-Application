import { expect, it, describe } from 'vitest';
import createItemsIdArr from '@utils/createItemsIdArr';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';

const cart: ClientResponse<Cart> = {
  body: {
    id: 'cartId',
    version: 1,
    lineItems: [
      {
        id: 'firstItem',
        productId: '1',
        variant: { id: 1 },
        name: {},
        productType: { typeId: 'product-type', id: '' },
        price: {
          id: '',
          value: { type: 'centPrecision', centAmount: 1, currencyCode: '', fractionDigits: 1 },
        },
        quantity: 1,
        totalPrice: { type: 'centPrecision', centAmount: 1, currencyCode: '', fractionDigits: 1 },
        discountedPricePerQuantity: [],
        taxedPricePortions: [],
        state: [],
        perMethodTaxRate: [],
        priceMode: 'ExternalPrice',
        lineItemMode: 'GiftLineItem',
      },
      {
        id: 'firstItem',
        productId: '2',
        variant: { id: 2 },
        name: {},
        productType: { typeId: 'product-type', id: '' },
        price: {
          id: '',
          value: { type: 'centPrecision', centAmount: 2, currencyCode: '', fractionDigits: 2 },
        },
        quantity: 2,
        totalPrice: { type: 'centPrecision', centAmount: 2, currencyCode: '', fractionDigits: 2 },
        discountedPricePerQuantity: [],
        taxedPricePortions: [],
        state: [],
        perMethodTaxRate: [],
        priceMode: 'ExternalPrice',
        lineItemMode: 'GiftLineItem',
      },
    ],
    customLineItems: [],
    totalPrice: { type: 'centPrecision', centAmount: 1, currencyCode: '', fractionDigits: 1 },
    taxMode: 'Disabled',
    taxRoundingMode: 'HalfDown',
    taxCalculationMode: 'LineItemLevel',
    inventoryMode: 'None',
    cartState: 'Active',
    shippingMode: 'Multiple',
    shipping: [],
    itemShippingAddresses: [],
    discountCodes: [],
    directDiscounts: [],
    refusedGifts: [],
    origin: 'Customer',
    createdAt: '',
    lastModifiedAt: '',
  },
};

const itemsIdArr = [
  {
    id: '1',
    variantId: 1,
  },
  {
    id: '2',
    variantId: 2,
  },
];

describe('create itemsIdArr', () => {
  it('should return itemsIdArr', () => {
    expect(createItemsIdArr(cart)).toStrictEqual(itemsIdArr);
    expect(createItemsIdArr(undefined)).toStrictEqual([]);
  });
});
