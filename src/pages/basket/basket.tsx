import { SHOP } from '@/config/localStorageConfig';
import { clearBasket, getBasket } from '@/services/basketController';
import styles from './basket.module.scss';
import { useEffect, useState } from 'react';
import type { LineItem } from '@commercetools/platform-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import ProductInBasket from '@/components/basket/ProductInBasket';
import { MONEY_SYMBOLS } from '@/interfaces/types';
import formatPrice from '@/utils/formatPrice';
import EmptyBasket from '@/components/basket/EmptyBasket';
import { setTotalItems } from '@/store/slices/basketSlice';
import type { RootState } from '@/store/store';
import { Link } from 'react-router-dom';
import { Path } from '@/config/routesConfig';

const SHIPPING_AMOUNT = 4.99;

function Basket() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isConfirmMessage, isVisible] = useState(false);
  const id =
    localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
  const basket = useSelector((state: RootState) => state.basket);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getBasket(id)
        .then(res => {
          if (res) {
            setItems(res.body.lineItems || []);
            setTotalPrice(res.body.totalPrice.centAmount);

            dispatch(setTotalItems(res.body.totalLineItemQuantity || 0));
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
  }, [basket.totalItems]);

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

  async function clearBasketByClick() {
    try {
      await clearBasket(id);
      dispatch(setTotalItems(0));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setDialogText(err.message));
        dispatch(toggleDialog(true));
      }
    }
  }

  function confirmMessage() {
    return (
      <div className={styles.basket_confirm}>
        <span onClick={clearBasketByClick}>Confirm</span>
        <span onClick={() => isVisible(false)}>Close</span>
      </div>
    );
  }

  function getOrdersSection() {
    return (
      <>
        {isConfirmMessage ? (
          confirmMessage()
        ) : (
          <p className={styles.basket_clear} onClick={() => isVisible(true)}>
            Clear basket
          </p>
        )}

        <div className={styles.basket_products}>{getItems()}</div>
        <div className={styles.basket_totals}>
          <div className={styles.total}>
            <p>Products</p>
            <p>{basket.totalItems}</p>
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
            <p>{`${MONEY_SYMBOLS.euro} ${SHIPPING_AMOUNT}`}</p>
          </div>
          <div className={`${styles.total}`}>
            <p className={styles.total_main}>Order total</p>
            <p className={styles.total_main}>{getOrderTotal()}</p>
          </div>
          {auth.isAuthorized ? (
            <button className={styles.total_confirm}>Confirm order</button>
          ) : (
            <Link className={styles.total_confirm} to={Path.login}>
              Go to login
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <section className={styles.basket}>
      <h2 className={styles.basket_title}>Checkout</h2>
      {basket.totalItems ? getOrdersSection() : <EmptyBasket />}
    </section>
  );
}

export default Basket;
