import { SHOP } from '@/config/localStorageConfig';
import { getBasket } from '@/services/basketController';

function Basket() {
  const id = localStorage.getItem(SHOP.client_cart_id);
  getBasket(id);
  return <section>basket</section>;
}

export default Basket;
