import styles from './productCard.module.scss';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';
import type I_ProductCardData from '@/interfaces/catalog/productCard';
import ProductDetails from '@/components/catalog/product/components/productDetails/productDetails';
import { AddToCart } from '@/assets/img/catalog/add-to-cart';
import { useEffect, useState } from 'react';
import { getBasket, updateBasket } from '@/services/basketController';
import { SHOP } from '@/config/localStorageConfig';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { IBasketUpdateActions } from '@/interfaces/types';
import { MONEY_SYMBOLS } from '@/interfaces/types';
import {
  addItemsId,
  changeTotalItems,
  removeItemId,
  setTotalItems,
} from '@/store/slices/basketSlice';

interface I_Attributes {
  name: string;
  value: {
    key: string;
    label: string;
  };
}

enum attributeNames {
  brand = 'brand',
  color = 'color',
  size = 'size',
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

  const dispatch = useDispatch();
  const priceValue = productPricesArray?.[0]?.value;
  const discountedValue = productPricesArray?.[0]?.discounted?.value;

  const variantAttributes: I_Attributes[] = (variants || []).flatMap(
    variant => variant.attributes || [],
  );
  const allAttributes = [...(attributes || []), ...variantAttributes];

  const brands = getAttributes(attributeNames.brand, allAttributes);
  const colors = getAttributes(attributeNames.color, allAttributes);
  const sizes = getAttributes(attributeNames.size, allAttributes);

  const [addToCartButton, setAddToCartButton] = useState<boolean>(false);

  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);

  const clientCartId = localStorage.getItem(SHOP.client_cart_id);
  const anonymousCartId = localStorage.getItem(SHOP.anonymous_cart_id);

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

  function formatPrice(price: number, fractionDigits: number = 2) {
    return (price / 100).toFixed(fractionDigits);
  }

  async function checkCart() {
    try {
      if (isAuthorized && clientCartId) {
        const cart = await getBasket(clientCartId);
        if (cart) {
          return cart.body;
        }
      }

      if (!isAuthorized && anonymousCartId) {
        const cart = await getBasket(anonymousCartId);
        if (cart) {
          return cart.body;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAddToCartButton(event: React.MouseEvent) {
    const target = event.target;

    if (target && (target instanceof HTMLElement || target instanceof SVGElement)) {
      const button = target.closest('button');

      if (button) {
        const cart = await checkCart();

        if (cart) {
          const cartId = cart.id;
          const cartVersion = cart.version;
          console.log('Basket is exist: ', cart);

          const productInCart = cart.lineItems.find(item => item.productId === productId);

          try {
            if (productInCart) {
              const response = await updateBasket(
                cartVersion,
                [
                  {
                    action: IBasketUpdateActions.removeLineItem,
                    lineItemId: productInCart.id,
                  },
                ],
                cartId,
              );
              if (response) {
                dispatch(setTotalItems(response.body.lineItems.length || 0));
              }
              dispatch(removeItemId({ id: productInCart.id, variantId: 1 }));
              setAddToCartButton(false);

              console.log('Product has removed from cart', response);
            } else {
              const response = await updateBasket(
                cartVersion,
                [
                  {
                    action: IBasketUpdateActions.addLineItem,
                    productId: productId,
                    variantId: 1,
                    quantity: 1,
                  },
                ],
                cartId,
              );

              dispatch(changeTotalItems(1));
              dispatch(addItemsId({ id: productId, variantId: 1 }));
              setAddToCartButton(true);

              console.log('Product has added in cart', response);
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }

  useEffect(() => {
    async function setAddToCartButtonActive() {
      const cart = await checkCart();

      if (cart) {
        const productInCart = cart.lineItems.find(item => item.productId === productId);

        if (productInCart) {
          setAddToCartButton(true);
        }
      }
    }

    setAddToCartButtonActive();
  }, []);

  return (
    <li className={styles.product}>
      <div className={styles['img-wrapper']}>
        <img
          src={imagesArray ? imagesArray[0].url : ''}
          alt={imagesArray ? imagesArray[0].label : ''}
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
