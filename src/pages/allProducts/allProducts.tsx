import { getProducts } from '@/services/productsController';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/catalog/product/productCard';
import type I_Product from '@/interfaces/catalog/product';
import styles from './allProducts.module.scss';

function AllProducts() {
  const [products, setProducts] = useState<I_Product[]>([]);

  useEffect(() => {
    async function getProductsData() {
      try {
        const response = await getProducts();

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;
          setProducts(productsData);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getProductsData().then(console.log);
  }, []);

  return (
    <section className={styles.catalog}>
      <div className="container">
        <div className={styles['search-content']}>
          <div className={styles['search-wrapper']}>
            <input
              className={styles.search}
              type="text"
              name="product-name"
              id="product-name"
              placeholder="Search in products..."
            />
          </div>
        </div>
        <div className={styles.filters}>
          <div className={styles.categories}>
            <ul className={styles['categories-list']}></ul>
          </div>
        </div>
        <ul className={styles.products}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AllProducts;
