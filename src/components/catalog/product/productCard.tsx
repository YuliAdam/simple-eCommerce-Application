import styles from './productCard.module.scss';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';
import type I_ProductCardData from '@/interfaces/catalog/productCard';
import ProductDetails from '@/components/catalog/product/components/productDetails/productDetails';
import { AddToCart } from '@/assets/img/catalog/add-to-cart';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { MONEY_SYMBOLS } from '@/interfaces/types';
import formatPrice from '@/utils/formatPrice';
import catalogPlaceholderImg from '@/assets/img/catalog-placeholder.png';
import { VARIANTS } from '@/interfaces/types';
import handleProductInCart from '@/components/catalog/product/handleCart';
import { useDispatch } from 'react-redux';

interface I_Attributes {
  name: string;
  value: {
    key: string;
    label: string;
  };
}

function ProductCard({ product }: { product: I_ProductCardData }) {
  const {
    id: productId,
    images: imagesArray,
    name: productName,
    description: productDescription,
    prices: productPricesArray,
    attributes,
    variants,
  } = product;

  const basket = useSelector((state: RootState) => state.basket);

  const priceValue = productPricesArray?.[0]?.value;
  const discountedValue = productPricesArray?.[0]?.discounted?.value;

  const variantAttributes: I_Attributes[] = (variants || []).flatMap(
    variant => variant.attributes || [],
  );
  const allAttributes = [...(attributes || []), ...variantAttributes];

  const brands = getAttributes(VARIANTS.brand, allAttributes);
  const colors = getAttributes(VARIANTS.color, allAttributes);
  const sizes = getAttributes(VARIANTS.size, allAttributes);

  const [addToCartButton, setAddToCartButton] = useState<boolean>(false);

  function getAttributes(name: string, attributes?: I_Attributes[]): Set<string> {
    const set = new Set<string>();
    if (attributes) {
      attributes.forEach(attribute => {
        if (attribute.name === name) {
          set.add(attribute.value.label);
        }
      });
    }
    return set;
  }

  const dispatch = useDispatch();

  async function handleAddToCartButton(event: React.MouseEvent) {
    const target = event.target;

    if (target && (target instanceof HTMLElement || target instanceof SVGElement)) {
      const button = target.closest('button');

      if (button) {
        setAddToCartButton(state => !state);

        await handleProductInCart(productId, dispatch);
      }
    }
  }

  useEffect(() => {
    function setAddToCartButtonActive() {
      if (!!basket.itemsId.find(item => item.id === productId)) {
        setAddToCartButton(true);
      }
    }
    setAddToCartButtonActive();
  }, [basket.totalItems, basket.itemsId]);

  return (
    <li className={styles.product}>
      <div className={styles['img-wrapper']}>
        <img
          src={imagesArray ? imagesArray[0].url : catalogPlaceholderImg}
          alt={imagesArray ? imagesArray[0].label : 'Image not found'}
          className={styles['product-img']}
        />
      </div>
      <div className={styles['product-info']}>
        <div className={styles['product-text-wrapper']}>
          <p className={styles['product-name']}>{productName || ''}</p>
          <p className={styles['product-description']}>{productDescription || ''}</p>
          <ProductDetails name="Brand" attributes={brands} />
          <ProductDetails name="Colors" attributes={colors} />
          <ProductDetails name="Sizes" attributes={sizes} />
        </div>
        <div className={styles['product-prices']}>
          {discountedValue ? (
            <>
              <p className={`${styles['product-discountPrice']} ${styles['product-main-price']}`}>
                <span>{MONEY_SYMBOLS.euro}</span>{' '}
                {formatPrice(discountedValue.centAmount, discountedValue.fractionDigits)}
              </p>
              <p className={`${styles['product-price']} ${styles['product-price-old']}`}>
                <span>{MONEY_SYMBOLS.euro}</span>{' '}
                {priceValue ? formatPrice(priceValue.centAmount, priceValue.fractionDigits) : ''}
              </p>
            </>
          ) : (
            <p className={`${styles['product-price']} ${styles['product-main-price']}`}>
              <span>{MONEY_SYMBOLS.euro}</span>{' '}
              {priceValue ? formatPrice(priceValue.centAmount, priceValue.fractionDigits) : ''}
            </p>
          )}
        </div>
      </div>
      <Link to={`${Path.product.replace(':id', productId)}`} className={styles.link}>
        Product info
      </Link>
      <button
        onClick={handleAddToCartButton}
        className={`${styles['add-button']} ${addToCartButton ? styles['add-button-active'] : ''}`}
      >
        <AddToCart className={styles.cart} />
      </button>
    </li>
  );
}

export default ProductCard;
