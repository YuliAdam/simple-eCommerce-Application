import { SHOP } from '@/config/localStorageConfig';
import { getBasket } from '@/services/basketController';
import styles from './basket.module.scss';
import { useEffect, useState } from 'react';
import type { LineItem } from '@commercetools/platform-sdk';
import { useDispatch } from 'react-redux';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import ProductInBasket from '@/components/basket/ProductInBasket';

function Basket() {
  const [items, setItems] = useState<LineItem[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const id = localStorage.getItem(SHOP.client_cart_id);
    if (id) {
      getBasket(id)
        .then(res => {
          if (res) {
            setItems(res.body.lineItems || []);
          }
        })
        .catch(err => {
          dispatch(setDialogText(err.message));
          dispatch(toggleDialog(true));
        });
    }
  }, []);

  function getItems() {
    return (
      <>
        {items.map(item => {
          return <ProductInBasket key={item.id} item={item} />;
        })}
      </>
    );
  }

  return (
    <section className={styles.basket}>
      <h2 className={styles.basket_title}>Checkout</h2>
      <div className={styles.basket_products}>{getItems()}</div>
    </section>
  );
}

export default Basket;
