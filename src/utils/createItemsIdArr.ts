import type { ItemsIdObject } from '@/interfaces/types';
import type { Cart, ClientResponse } from '@commercetools/platform-sdk';

export default function createItemsIdArr(cart: ClientResponse<Cart> | undefined): ItemsIdObject[] {
  return cart
    ? cart.body.lineItems.map(item => {
        return { id: item.productId, variantId: item.variant.id };
      })
    : [];
}
