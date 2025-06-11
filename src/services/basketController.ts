import { SHOP } from '@/config/localStorageConfig';
import { apiRoot } from './client';
import type { CartUpdateAction, MyCartDraft } from '@commercetools/platform-sdk';
import { apiRootAnonymous } from './anonymousFlow';
import { withPasswordFlow } from './flow/passwordFlow';
import { IBasketUpdateActions } from '@/interfaces/types';

export async function getBasket(id = localStorage.getItem(SHOP.anonymous_cart_id)) {
  if (id) {
    return await apiRoot.carts().withId({ ID: id }).get().execute();
  }
}

export async function getActiveBasket(login: string, password: string) {
  return await withPasswordFlow(login, password).me().activeCart().get().execute();
}

export async function createAnonymousBasket(body: MyCartDraft) {
  const response = await apiRootAnonymous
    .me()
    .carts()
    .post({
      body: body,
    })
    .execute();

  localStorage.setItem(SHOP.anonymous_cart_id, response.body.id);
  localStorage.setItem(SHOP.anonymous_id, response.body.anonymousId || '');
}

export async function createBasket(body: MyCartDraft, login: string, password: string) {
  return await withPasswordFlow(login, password)
    .me()
    .carts()
    .post({
      body: body,
    })
    .execute();
}

export async function updateBasket(
  version: number,
  actions: CartUpdateAction[],
  id = localStorage.getItem(SHOP.anonymous_cart_id),
) {
  if (id) {
    return await apiRoot
      .carts()
      .withId({ ID: id })
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();
  }
}

//TODO: change method with merge carts method
export async function copyInBasket(
  version: number,
  idTo: string,
  idFrom = localStorage.getItem(SHOP.anonymous_cart_id),
) {
  const fromBasket = await getBasket(idFrom);
  if (fromBasket) {
    const items = fromBasket.body.lineItems;
    const actions: CartUpdateAction[] = items.map(product => {
      return {
        action: IBasketUpdateActions.addLineItem,
        productId: product.productId,
        variantId: product.variant.id,
        quantity: product.quantity,
      };
    });
    return await updateBasket(version, actions, idTo);
  }
}

export async function clearBasket(id = localStorage.getItem(SHOP.anonymous_cart_id)) {
  const basket = await getBasket(id);
  if (basket) {
    const actions: CartUpdateAction[] = basket.body.lineItems.map(item => {
      return { action: IBasketUpdateActions.removeLineItem, lineItemId: item.id };
    });
    return await updateBasket(basket.body.version, actions, id);
  }
}
