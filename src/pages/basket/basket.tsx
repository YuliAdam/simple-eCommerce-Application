import { SHOP } from '@/config/localStorageConfig';
import { clearBasket, getBasket, getDiscountCode, updateBasket } from '@/services/basketController';
import styles from './basket.module.scss';
import { useEffect, useState } from 'react';
import type { CartUpdateAction, LineItem } from '@commercetools/platform-sdk';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCode,
  setDialogText,
  toggleCodeForm,
  toggleDialog,
  validationCode,
} from '@/store/slices/dialogSlice';
import ProductInBasket from '@/components/basket/ProductInBasket';
import { IBasketUpdateActions, MONEY_SYMBOLS } from '@/interfaces/types';
import formatPrice from '@/utils/formatPrice';
import EmptyBasket from '@/components/basket/EmptyBasket';
import { setTotalItems, setTotalPrice } from '@/store/slices/basketSlice';
import type { RootState } from '@/store/store';
import { Link } from 'react-router-dom';
import { Path } from '@/config/routesConfig';
import Plus from '@/assets/img/plus';
import { CloseButton } from '@/assets/img/CloseButton';

const SHIPPING_AMOUNT = 4.99;
const CODE_MODAL_MESSAGE = 'Add a discount code';

function Basket() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isConfirmMessage, isVisible] = useState(false);
  const id =
    localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
  const basket = useSelector((state: RootState) => state.basket);
  const auth = useSelector((state: RootState) => state.auth);
  const dialog = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch();

  useEffect(() => {
    setDiscount(0);
    if (id) {
      getBasket(id)
        .then(res => {
          if (res) {
            setItems(res.body.lineItems || []);
            dispatch(setTotalPrice(res.body.totalPrice.centAmount));
            dispatch(setTotalItems(res.body.totalLineItemQuantity || 0));
            if (res.body.discountCodes.length !== 0) {
              getDiscountCode(res.body.discountCodes[0].discountCode.id).then(resp => {
                dispatch(setCode(resp.body.code));
                dispatch(validationCode(true));
                if (res.body.discountOnTotalPrice) {
                  setDiscount(res.body.discountOnTotalPrice.discountedAmount.centAmount);
                }
              });
            } else {
              dispatch(setCode(''));
              dispatch(validationCode(false));
            }
            let discountSum = res.body.lineItems.reduce((sum, item) => {
              const notDiscountPrice = item.price.value.centAmount * item.quantity;
              return notDiscountPrice !== item.totalPrice.centAmount
                ? sum + (notDiscountPrice - item.totalPrice.centAmount)
                : sum;
            }, 0);
            setDiscount(discountSum);
          }
        })
        .catch(err => {
          dispatch(setDialogText(err.message));
          dispatch(toggleDialog(true));
        });
    }
  }, [basket.totalItems, basket.totalPrice]);

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
    return `${MONEY_SYMBOLS.euro} ${formatPrice(basket.totalPrice + SHIPPING_AMOUNT * 100)}`;
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

  function openCodeModal() {
    dispatch(setDialogText(CODE_MODAL_MESSAGE));
    dispatch(setCode(''));
    dispatch(toggleCodeForm(true));
    dispatch(toggleDialog(true));
  }

  async function removeCode() {
    const basketId = localStorage.getItem(SHOP.client_cart_id);
    try {
      const basket = await getBasket(basketId);
      const actions: CartUpdateAction[] = [];
      if (basket) {
        actions.push({
          action: IBasketUpdateActions.removeDiscountCode,
          discountCode: {
            typeId: 'discount-code',
            id: basket.body.discountCodes[0].discountCode.id || '',
          },
        });
        const response = await updateBasket(basket.body.version, actions, basketId);
        response && dispatch(setTotalPrice(response.body.totalPrice.centAmount || 0));
        dispatch(validationCode(false));
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setDialogText(err.message));
        dispatch(toggleDialog(true));
      }
    }
  }

  function addDiscountCodeSection() {
    return (
      <div className={styles.total}>
        <p>Add a discount code</p>
        <div className={styles.code_wrap}>
          {dialog.values.isOpen || !dialog.values.isValidCode ? (
            <div className={styles.item_btn_wrap} onClick={openCodeModal}>
              <Plus className={styles.item_btn}></Plus>
            </div>
          ) : (
            <>
              <p className={styles.code}>{dialog.values.codeValue}</p>
              <div className={styles.code_close_wrap} onClick={removeCode}>
                <CloseButton className={styles.code_close} />
              </div>
            </>
          )}
        </div>
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
          {auth.isAuthorized ? addDiscountCodeSection() : ''}
          <div className={styles.total}>
            <p>Products</p>
            <p>{basket.totalItems}</p>
          </div>
          <div className={styles.total}>
            <p>Subtotal</p>
            <p>{`${MONEY_SYMBOLS.euro} ${formatPrice(basket.totalPrice)}`}</p>
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
