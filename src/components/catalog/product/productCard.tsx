import type I_Product from '@/interfaces/catalog/product';
import styles from './productCard.module.scss';

function ProductCard({ product }: { product: I_Product }) {
  const imagesArray = product.masterData.current.masterVariant.images,
    productName = product.masterData.current.name,
    productDescription = product.masterData.current.description;

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
        <p className={styles['product-name']}>{productName ? productName['en-GB'] : ''}</p>
        <p className={styles['product-description']}>
          {productDescription ? productDescription['en-GB'] : ''}
        </p>
      </div>
    </li>
  );
}

export default ProductCard;
