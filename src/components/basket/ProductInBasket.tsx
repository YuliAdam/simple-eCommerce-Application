import { Dot } from '@/assets/img/dot';
import Minus from '@/assets/img/minus';
import Plus from '@/assets/img/plus';
import Trash from '@/assets/img/trash';
import { SHOP } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import {
  AttributesName,
  IBasketUpdateActions,
  MONEY_SYMBOLS,
  TEXT_LANGUAGES,
} from '@/interfaces/types';
import { getBasket, updateBasket } from '@/services/basketController';
import { changeTotalItems, setItemsId, setTotalItems } from '@/store/slices/basketSlice';
import { openDialogWithMessage } from '@/store/slices/dialogSlice';
import createItemsIdArr from '@/utils/createItemsIdArr';
import formatPrice from '@/utils/formatPrice';
import type { Attribute, CartUpdateAction, LineItem } from '@commercetools/platform-sdk';
import styles from '@pages/basket/basket.module.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ProductInBasket({ item }: { item: LineItem }) {
  const basketId =
    localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function getAttributeValue(name: string, attributes: Attribute[]) {
    return (
      attributes.find(attribute => attribute.name === name) || { value: { label: '', key: '' } }
    );
  }

  function getAttributes() {
    return item.variant.attributes ? (
      <>
        <p className={styles.item_brand}>
          {getAttributeValue(AttributesName.brand, item.variant.attributes).value.label}
        </p>
        <p className={styles.item_size}>
          {`Size: ${getAttributeValue(AttributesName.size, item.variant.attributes).value.key.toUpperCase()}`}
        </p>
        <div className={styles.item_color}>
          <p>Color</p>
          <Dot
            stroke={getAttributeValue(AttributesName.color, item.variant.attributes).value.key}
          />
        </div>
        <div>
          <span className={styles.item_size}>
            {`Price: ${MONEY_SYMBOLS.euro} ${!item.price.discounted ? formatPrice(item.price.value.centAmount) : formatPrice(item.price.discounted.value.centAmount)} `}
          </span>
          {item.price.discounted ? (
            <span className={styles.item_price_old}>
              {formatPrice(item.price.value.centAmount)}
            </span>
          ) : (
            ''
          )}
        </div>
      </>
    ) : (
      ''
    );
  }

  function getPrices() {
    const notDiscountPrice = item.price.value.centAmount * item.quantity;
    return (
      <div className={styles.item_price}>
        <h2
          className={styles.item_price_actual}
        >{`${MONEY_SYMBOLS.euro} ${formatPrice(item.totalPrice.centAmount)}`}</h2>
        {notDiscountPrice !== item.totalPrice.centAmount && (
          <p
            className={styles.item_price_old}
          >{`${MONEY_SYMBOLS.euro} ${formatPrice(item.price.value.centAmount * item.quantity)}`}</p>
        )}
      </div>
    );
  }

  async function deleteProduct() {
    try {
      const basket = await getBasket(basketId);
      const actions: CartUpdateAction[] = [];
      actions.push({ action: IBasketUpdateActions.removeLineItem, lineItemId: item.id });
      if (basket) {
        const newBasket = await updateBasket(basket.body.version, actions, basketId);
        dispatch(setTotalItems(newBasket?.body.totalLineItemQuantity || 0));
        dispatch(setItemsId(createItemsIdArr(newBasket)));
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(openDialogWithMessage(err.message));
      }
    }
  }
  async function changeProductQuantity(num: number) {
    try {
      const basket = await getBasket(basketId);
      const actions: CartUpdateAction[] = [];
      actions.push({
        action: IBasketUpdateActions.changeLineItemQuantity,
        lineItemId: item.id,
        quantity: item.quantity + num,
      });
      if (basket) {
        const newBasket = await updateBasket(basket.body.version, actions, basketId);
        dispatch(changeTotalItems(num));
        if (item.quantity + num === 0) {
          dispatch(setItemsId(createItemsIdArr(newBasket)));
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(openDialogWithMessage(err.message));
      }
    }
  }

  function navigateToProductPage() {
    navigate(`${Path.product.replace(':id', item.productId)}`);
  }

  return (
    <div className={styles.basket_item}>
      <div
        className={styles.img_wrap}
        style={{
          backgroundImage: `url("${item.variant.images && item.variant.images[0].url}")`,
        }}
        onClick={navigateToProductPage}
      ></div>
      <div className={styles.item_wrap}>
        <div className={styles.item_info_wrap}>
          <div className={styles.item_info}>
            <h1 className={styles.item_title} onClick={navigateToProductPage}>
              {item.name[TEXT_LANGUAGES.enGB]}
            </h1>
            {getAttributes()}
          </div>
          <div className={styles.item_controller}>
            <div className={styles.item_quantity_wrap}>
              <div className={styles.item_btn_wrap} onClick={() => changeProductQuantity(-1)}>
                <Minus className={styles.item_btn} />
              </div>
              <p>{item.quantity}</p>
              <div className={styles.item_btn_wrap} onClick={() => changeProductQuantity(+1)}>
                <Plus className={styles.item_btn} />
              </div>
            </div>
            <div onClick={deleteProduct}>
              <Trash className={styles.item_trash} />
            </div>
          </div>
        </div>
        {getPrices()}
      </div>
    </div>
  );
}
