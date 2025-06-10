import { SHOP } from '@/config/localStorageConfig';
import { apiRoot } from './client';
import type { CartUpdateAction, MyCartDraft } from '@commercetools/platform-sdk';
import { apiRootAnonymous } from './anonymousFlow';
import { withPasswordFlow } from './flow/passwordFlow';

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
}

export async function createBasket(body: MyCartDraft, login: string, password: string) {
  await withPasswordFlow(login, password)
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
    await apiRoot
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
