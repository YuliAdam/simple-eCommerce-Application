import ProductDetailed from '@/components/catalog/product/productDetailed';
import Spinner from '@/components/catalog/spinner/spinner';
import { getProducts } from '@/services/productsController';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './product.module.scss';
import type I_ProductDetailed from '@/interfaces/catalog/productDetailed';

function Product(/*product?*/) {
  // TODO: make change title to product name
  const [product, setProduct] = useState<I_ProductDetailed[]>([]);
  const params = useParams();
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await getProducts();

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;
          setProduct(productsData);
          console.log(productsData[1]);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchProduct();
  }, []);
  return (
    <div className={styles.container}>
      <title>{`Product - ${params.id}`}</title>
      {product.length > 0 ? (
        <ProductDetailed key={product[9].id} product={product[9]} />
      ) : (
        <Spinner />
      )}
    </div>
  );
}
/* TODO: list of components
   - Image
   - Slider
   - ProductDetails?
   - Button
   - ImageModal?
*/
export default Product;
