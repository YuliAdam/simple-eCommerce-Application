import styles from './productDetails.module.scss';

function ProductDetails({ name, attributes }: { name: string; attributes: Set<string> }) {
  return (
    <ul className={styles['product-details']}>
      <li className={styles['product-detail']}>
        <h4 className={styles['product-detail-header']}>{name}:</h4>
        <p className={styles['product-detail-name']}>
          {Array.from(attributes)
            .map(brand => brand)
            .join(', ')}
        </p>
      </li>
    </ul>
  );
}

export default ProductDetails;
