import { SHOP } from '@/config/localStorageConfig';
import { getBasket, updateBasket } from '@/services/basketController';
import styles from './basket.module.scss';
import { useEffect, useState } from 'react';
import type { CartUpdateAction, LineItem } from '@commercetools/platform-sdk';
import { useDispatch } from 'react-redux';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import ProductInBasket from '@/components/basket/ProductInBasket';
import { IBasketUpdateActions, MONEY_SYMBOLS } from '@/interfaces/types';
import formatPrice from '@/utils/formatPrice';
import EmptyBasket from '@/components/basket/EmptyBasket';

const SHIPPING_AMOUNT = 4.99;
const SHIPPING_VALUE = `${MONEY_SYMBOLS.euro} ${SHIPPING_AMOUNT}`;

function Basket() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const id =
    localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getBasket(id)
        .then(res => {
          if (res) {
            setItems(res.body.lineItems || []);
            setTotalPrice(res.body.totalPrice.centAmount);
            setTotalItems(res.body.totalLineItemQuantity || 0);
            let discountSum = res.body.lineItems.reduce(
              (sum, item) =>
                item.price.discounted
                  ? sum + (item.price.value.centAmount * item.quantity - item.totalPrice.centAmount)
                  : sum,
              0,
            );
            setDiscount(discountSum);
          }
        })
        .catch(err => {
          dispatch(setDialogText(err.message));
          dispatch(toggleDialog(true));
        });
    }
  }, [totalItems]);

  function getItems() {
    return (
      <>
        {items.map(item => (
          <ProductInBasket key={item.id + item.name} item={item} />
        ))}
      </>
    );
  }

  function getOrderTotal() {
    return `${MONEY_SYMBOLS.euro} ${formatPrice(totalPrice + SHIPPING_AMOUNT * 100)}`;
  }

  async function clearBasket() {
    try {
      const basket = await getBasket(id);
      const actions: CartUpdateAction[] = [];
      items.forEach(item => {
        actions.push({ action: IBasketUpdateActions.removeLineItem, lineItemId: item.id });
      });
      if (basket) {
        await updateBasket(basket.body.version, actions, id);
        setTotalItems(0);
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setDialogText(err.message));
        dispatch(toggleDialog(true));
      }
    }
  }

  function getOrdersSection() {
    return (
      <>
        <p className={styles.basket_clear} onClick={clearBasket}>
          Clear basket
        </p>
        <div className={styles.basket_products}>{getItems()}</div>
        <div className={styles.basket_totals}>
          <div className={styles.total}>
            <p>Products</p>
            <p>{totalItems}</p>
          </div>
          <div className={styles.total}>
            <p>Subtotal</p>
            <p>{`${MONEY_SYMBOLS.euro} ${formatPrice(totalPrice)}`}</p>
          </div>
          {discount ? (
            <div className={styles.total}>
              <p className={styles.discount}>Discount</p>
              <p className={styles.discount}>{`${MONEY_SYMBOLS.euro} ${formatPrice(discount)}`}</p>
            </div>
          ) : (
            ''
          )}
          <div className={styles.total}>
            <p>Shipping estimate</p>
            <p>{SHIPPING_VALUE}</p>
          </div>
          <div className={`${styles.total}`}>
            <p className={styles.total_main}>Order total</p>
            <p className={styles.total_main}>{getOrderTotal()}</p>
          </div>
          <button className={styles.total_confirm}>Confirm order</button>
        </div>
      </>
    );
  }

  return (
    <section className={styles.basket}>
      <h2 className={styles.basket_title}>Checkout</h2>
      {totalItems ? getOrdersSection() : <EmptyBasket />}
    </section>
  );
}

export default Basket;
