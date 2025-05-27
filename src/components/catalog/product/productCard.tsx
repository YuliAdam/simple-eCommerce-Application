import type I_Product from '@/interfaces/catalog/product';
import styles from './productCard.module.scss';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';

function ProductCard({ product }: { product: I_Product }) {
  const data = product.masterData.current,
    id = product.id,
    imagesArray = data.masterVariant.images,
    productName = data.name,
    productDescription = data.description,
    productPricesArray = data.masterVariant?.prices,
    priceValue = productPricesArray?.[0]?.value,
    discountedValue = productPricesArray?.[0]?.discounted?.value;

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
            <p className={styles['product-name']}>{productName ? productName['en-GB'] : ''}</p>
            <p className={styles['product-description']}>
              {productDescription ? productDescription['en-GB'] : ''}
            </p>
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
