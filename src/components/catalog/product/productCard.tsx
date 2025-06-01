import styles from './productCard.module.scss';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';
import type I_ProductCardData from '@/interfaces/catalog/productCard';

function ProductCard({ product }: { product: I_ProductCardData }) {
  const data = product,
    id = product.id,
    imagesArray = data.images,
    productName = data.name,
    productDescription = data.description,
    productPricesArray = data.prices,
    priceValue = productPricesArray?.[0]?.value,
    discountedValue = productPricesArray?.[0]?.discounted?.value,
    attributes = data?.attributes,
    variants = data?.variants,
    brands = new Set<string>(),
    colors = new Set<string>(),
    sizes = new Set<string>();

  if (attributes) {
    attributes.map(attribute => {
      const attributesData = attribute.value;
      if (attributesData) {
        if (attribute.name === 'brand') {
          brands.add(attribute.value.label);
        }

        if (attribute.name === 'color') {
          colors.add(attribute.value.label);
        }

        if (attribute.name === 'size') {
          sizes.add(attribute.value.label);
        }
      }
    });
  }

  if (variants) {
    variants.map(variant => {
      const attributesData = variant.attributes;
      if (attributesData) {
        attributesData.map(attribute => {
          if (attribute.name === 'brand') {
            brands.add(attribute.value.label);
          }

          if (attribute.name === 'color') {
            colors.add(attribute.value.label);
          }

          if (attribute.name === 'size') {
            sizes.add(attribute.value.label);
          }
        });
      }
    });
  }

  return (
    <Link to={`${Path.product.replace(':id', id)}`} className={styles.link}>
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
            <p className={styles['product-name']}>{productName ? productName : ''}</p>
            <p className={styles['product-description']}>
              {productDescription ? productDescription : ''}
            </p>
            <ul className={styles['product-details']}>
              <li className={styles['product-detail']}>
                <h4 className={styles['product-detail-header']}>Brand:</h4>
                <p className={styles['product-detail-name']}>
                  {Array.from(brands)
                    .map(brand => brand)
                    .join(', ')}
                </p>
              </li>
            </ul>
            <ul className={styles['product-details']}>
              <li className={styles['product-detail']}>
                <h4 className={styles['product-detail-header']}>Colors:</h4>
                <p className={styles['product-detail-name']}>
                  {Array.from(colors)
                    .map(color => color)
                    .join(', ')}
                </p>
              </li>
            </ul>
            <ul className={styles['product-details']}>
              <li className={styles['product-detail']}>
                <h4 className={styles['product-detail-header']}>Sizes:</h4>
                <p className={styles['product-detail-name']}>
                  {Array.from(sizes)
                    .map(size => size)
                    .join(', ')}
                </p>
              </li>
            </ul>
          </div>
          <div className={styles['product-prices']}>
            {discountedValue ? (
              <>
                <p className={`${styles['product-discountPrice']} ${styles['product-main-price']}`}>
                  <span>€</span>{' '}
                  {discountedValue
                    ? (discountedValue.centAmount / 100).toFixed(discountedValue.fractionDigits)
                    : ''}
                </p>
                <p className={`${styles['product-price']} ${styles['product-price-old']}`}>
                  <span>€</span>{' '}
                  {priceValue
                    ? (priceValue.centAmount / 100).toFixed(priceValue.fractionDigits)
                    : ''}
                </p>
              </>
            ) : (
              <p className={`${styles['product-price']} ${styles['product-main-price']}`}>
                <span>€</span>{' '}
                {priceValue ? (priceValue.centAmount / 100).toFixed(priceValue.fractionDigits) : ''}
              </p>
            )}
          </div>
        </div>
      </li>
    </Link>
  );
}

export default ProductCard;
