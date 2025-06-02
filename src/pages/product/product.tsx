import ProductDetailed from '@/components/catalog/product/productDetailed';
import Spinner from '@/components/catalog/spinner/spinner';
import { getProducts } from '@/services/productsController';
import type { Product } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './product.module.scss';

function Product() {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts();

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;
          const productId = params.id;
          const foundProduct = productsData.find(product => product.id === productId);

          if (foundProduct) {
            setCurrentProduct(foundProduct);
            setTitle(foundProduct?.masterData?.current?.name?.['en-GB'] ?? '');
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <title>{`Product: ${title || 'not found'}`}</title>
      {!currentProduct ? (
        <p style={{ fontSize: '1.9rem', color: 'gray' }}>
          Product not found. Please check the product ID.
        </p>
      ) : (
        <ProductDetailed key={currentProduct.id} product={currentProduct} />
      )}
    </div>
  );
}

export default Product;
