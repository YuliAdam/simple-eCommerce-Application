import { Dot } from '@/assets/img/dot';
import Minus from '@/assets/img/minus';
import Plus from '@/assets/img/plus';
import { AttributesName, MONEY_SYMBOLS, TEXT_LANGUAGES } from '@/interfaces/types';
import formatPrice from '@/utils/formatPrice';
import type { Attribute, LineItem } from '@commercetools/platform-sdk';
import styles from '@pages/basket/basket.module.scss';

export default function ProductInBasket({ item }: { item: LineItem }) {
  function getAttributeValue(name: string, attributes: Attribute[]) {
    return attributes.find(attribute => attribute.name === name);
  }

  function getAttributes() {
    return item.variant.attributes ? (
      <>
        <p className={styles.item_brand}>
          {getAttributeValue(AttributesName.brand, item.variant.attributes)?.value.label}
        </p>
        <p className={styles.item_size}>
          {`Size: ${getAttributeValue(AttributesName.size, item.variant.attributes)?.value.key.toUpperCase()}`}
        </p>
        <div className={styles.item_color}>
          <p>Color</p>
          <Dot
            stroke={getAttributeValue(AttributesName.color, item.variant.attributes)?.value.key}
          />
        </div>
      </>
    ) : (
      ''
    );
  }

  function getPrices() {
    return (
      <div className={styles.item_price}>
        <h5
          className={styles.item_price_actual}
        >{`${MONEY_SYMBOLS.euro} ${formatPrice(item.totalPrice.centAmount)}`}</h5>
        {item.price.discounted && (
          <p
            className={styles.item_price_old}
          >{`${MONEY_SYMBOLS.euro} ${formatPrice(item.price.value.centAmount * item.quantity)}`}</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.basket_item}>
      <div
        className={styles.img_wrap}
        style={{
          backgroundImage: `url("${item.variant.images && item.variant.images[0].url}")`,
        }}
      ></div>
      <div className={styles.item_wrap}>
        <div className={styles.item_info_wrap}>
          <div className={styles.item_info}>
            <h5 className={styles.item_title}>{item.name[TEXT_LANGUAGES.enGB]}</h5>
            {getAttributes()}
          </div>
          <div className={styles.item_quantity_wrap}>
            <div className={styles.item_btn_wrap}>
              <Minus className={styles.item_btn} />
            </div>
            <p>{item.quantity}</p>
            <div className={styles.item_btn_wrap}>
              <Plus className={styles.item_btn} />
            </div>
          </div>
        </div>
        {getPrices()}
      </div>
    </div>
  );
}
