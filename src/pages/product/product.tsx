import ProductDetailed from '@/components/catalog/product/productDetailed';
import Spinner from '@/components/catalog/spinner/spinner';
import { getProducts } from '@/services/productsController';
import type { Product } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './product.module.scss';

function Product() {
  const [products, setProducts] = useState<Product[]>([]);
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
          setProducts(productsData);

          const requestedIndex = parseInt(params.id ?? '0', 10);
          const maxIndex = productsData.length - 1;
          const productIndex = Math.min(Math.max(0, requestedIndex), maxIndex);
          const currentProduct = productsData[productIndex];
          setTitle(currentProduct?.masterData?.current?.name?.['en-GB'] ?? '');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [params.id]);

  const requestedIndex = parseInt(params.id ?? '0', 10);
  //FIXME: 10id product doesnt work properly
  const maxIndex = products.length - 1;
  const productIndex = Math.min(Math.max(0, requestedIndex), maxIndex);
  const currentProduct = products[productIndex];

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <title>{`Product: ${title || `Product ${productIndex + 1}`}`}</title>
      {requestedIndex > maxIndex ? (
        <p style={{ fontSize: '1.9rem', color: 'gray' }}>
          Product not found. Available products: 0-{maxIndex}
        </p>
      ) : (
        <ProductDetailed key={currentProduct.id} product={currentProduct} />
      )}
    </div>
  );
}
export default Product;
