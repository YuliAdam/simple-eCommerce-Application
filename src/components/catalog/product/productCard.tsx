import styles from './productCard.module.scss';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';
import type I_ProductCardData from '@/interfaces/catalog/productCard';
import ProductDetails from '@/components/catalog/product/components/productDetails/productDetails';
import { MONEY_SYMBOLS } from '@/interfaces/types';

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

  return (
    <Link to={`${Path.product.replace(':id', productId)}`} className={styles.link}>
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
                  <span>{MONEY_SYMBOLS.euro}</span>{' '}
                  {discountedValue
                    ? formatPrice(discountedValue.centAmount, discountedValue.fractionDigits)
                    : ''}
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
      </li>
    </Link>
  );
}

export default ProductCard;
