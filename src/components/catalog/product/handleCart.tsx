import checkCart from '@/components/catalog/product/isCartExist';
import { updateBasket } from '@/services/basketController';
import { IBasketUpdateActions } from '@/interfaces/types';
import {
  addItemsId,
  changeTotalItems,
  setItemsId,
  setTotalItems,
} from '@/store/slices/basketSlice';
import { openDialogWithMessage } from '@/store/slices/dialogSlice';
import createItemsIdArr from '@/utils/createItemsIdArr';
import type { AppDispatch } from '@/store/store';

export default async function handleProductInCart(productId: string, dispatchFunc: AppDispatch) {
  try {
    const cart = await checkCart();

    if (cart) {
      const cartId = cart.id;
      const cartVersion = cart.version;
      let productInCart = cart.lineItems.filter(item => item.productId === productId);

      if (productInCart.length) {
        const response = await updateBasket(
          cartVersion,
          productInCart.map(item => {
            return {
              action: IBasketUpdateActions.changeLineItemQuantity,
              lineItemId: item.id,
              quantity: 0,
            };
          }),

          cartId,
        );

        if (response) {
          dispatchFunc(setTotalItems(response.body.totalLineItemQuantity || 0));
          dispatchFunc(setItemsId(createItemsIdArr(response)));
        }

        console.log('Product has removed from cart', response);
      } else {
        const response = await updateBasket(
          cartVersion,
          [
            {
              action: IBasketUpdateActions.addLineItem,
              productId: productId,
              variantId: 1,
              quantity: 1,
            },
          ],
          cartId,
        );

        dispatchFunc(changeTotalItems(1));
        dispatchFunc(addItemsId({ id: productId, variantId: 1 }));

        console.log('Product has added in cart', response);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      dispatchFunc(openDialogWithMessage(err.message));
    }
  }
}
