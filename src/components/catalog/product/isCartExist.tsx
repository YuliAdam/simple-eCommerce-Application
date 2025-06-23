import { getBasket } from '@/services/basketController';
import { SHOP } from '@/config/localStorageConfig';

export default async function checkCart() {
  const id =
    localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
  const cart = await getBasket(id);
  if (cart) return cart.body;
}
