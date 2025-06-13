import styles from './productCard.module.scss';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';
import type I_ProductCardData from '@/interfaces/catalog/productCard';
import ProductDetails from '@/components/catalog/product/components/productDetails/productDetails';
import { AddToCart } from '@/assets/img/catalog/add-to-cart';
import { useState } from 'react';

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

  const priceValue = productPricesArray?.[0]?.value;
  const discountedValue = productPricesArray?.[0]?.discounted?.value;

  const variantAttributes: I_Attributes[] = (variants || []).flatMap(
    variant => variant.attributes || [],
  );
  const allAttributes = [...(attributes || []), ...variantAttributes];

  const brands = getAttributes(attributeNames.brand, allAttributes);
  const colors = getAttributes(attributeNames.color, allAttributes);
  const sizes = getAttributes(attributeNames.size, allAttributes);

  const currencySymbol = '€';

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

  function formatPrice(price: number, fractionDigits: number = 2) {
    return (price / 100).toFixed(fractionDigits);
  }

  function handleAddToCartButton(event: React.MouseEvent) {
    const target = event.target;

    if (target) {
      setAddToCartButton(state => !state);
    }
  }

  return (
    <li className={styles.product}>
      <div className={styles['img-wrapper']}>
        <img
          src={imagesArray ? imagesArray?.[0].url : ''}
          alt={imagesArray ? imagesArray?.[0].label : ''}
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
                <span>{currencySymbol}</span>{' '}
                {discountedValue
                  ? formatPrice(discountedValue.centAmount, discountedValue.fractionDigits)
                  : ''}
              </p>
              <p className={`${styles['product-price']} ${styles['product-price-old']}`}>
                <span>{currencySymbol}</span>{' '}
                {priceValue ? formatPrice(priceValue.centAmount, priceValue.fractionDigits) : ''}
              </p>
            </>
          ) : (
            <p className={`${styles['product-price']} ${styles['product-main-price']}`}>
              <span>{currencySymbol}</span>{' '}
              {priceValue ? formatPrice(priceValue.centAmount, priceValue.fractionDigits) : ''}
            </p>
          )}
        </div>
      </div>
      <Link to={`${Path.product.replace(':id', productId)}`} className={styles.link}>
        View more
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
