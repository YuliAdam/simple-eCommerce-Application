import { getProducts, getCatregories, getProductsByCategory } from '@/services/productsController';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/catalog/product/productCard';
import type I_Product from '@/interfaces/catalog/product';
import type I_Category from '@/interfaces/catalog/category';
import type I_SubCategory from '@/interfaces/catalog/subCategory';
import styles from './allProducts.module.scss';
import createBreadCrumbs from '@/pages/allProducts/createBreadcrumbs';
import CategoryItem from '@/components/catalog/category-item/category-item';

function AllProducts() {
  const [products, setProducts] = useState<I_Product[]>([]);
  const [categories, setCategories] = useState<I_Category[]>([]);
  const [subCategories, setSubCategories] = useState<I_SubCategory[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);
  const [activeCategoryButton, setactiveCategoryButton] = useState<string | null>(null);

  useEffect(() => {
    async function getProductsData() {
      try {
        const response = await getProducts();

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;
          setProducts(productsData);
          console.log('Products: ', productsData);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getProductsData();
  }, []);

  useEffect(() => {
    async function getCategoriesData() {
      try {
        const response = await getCatregories();

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;

          const categoriesData = productsData.filter(el => {
            if (el && el.parent === undefined) {
              return el;
            }
          });

          setCategories(categoriesData);
          console.log('Categories: ', categoriesData);

          const subCategoriesData = productsData.filter(el => {
            if (el && el.parent) {
              return el;
            }
          });
          setSubCategories(subCategoriesData);
          console.log('Subcategories: ', subCategoriesData);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getCategoriesData();
  }, []);

  function handleCategoryButton(event: React.MouseEvent) {
    const target = event.target;

    if (target && target instanceof HTMLButtonElement) {
      const id = target.getAttribute('data-id');

      if (id) {
        setactiveCategoryButton(id);

        async function getProductsData(id: string) {
          try {
            const response = await getProductsByCategory(id);

            if (response && response.statusCode === 200) {
              const productsData = response.body.results;
              setProducts(productsData);
              console.log('Products by category: ', productsData);
            }
          } catch (err) {
            console.log(err);
          }
        }

        const breadcrumbs = createBreadCrumbs(categories, subCategories, id);

        setBreadcrumbs(breadcrumbs);
        getProductsData(id);
        window.history.pushState(
          {},
          '',
          `/products/${encodeURIComponent(target.textContent ?? '')}`,
        );
      }
    }
  }

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
        <div className={styles.breadcrumbs}>
          <ul className={styles['breadcrumbs-list']}>
            {breadcrumbs.map((breadcrumb, i) => (
              <li
                key={i}
                className={`${styles['breadcrumb-item']} ${i === breadcrumbs.length - 1 ? styles['no-arrow'] : ''}`}
              >
                <button
                  data-id={breadcrumb.id}
                  className={styles['breadcrumb-button']}
                  onClick={handleCategoryButton}
                >
                  {breadcrumb.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles['catalog-wrapper']}>
          <div className={styles.filters}>
            <div className={styles.categories}>
              <h2 className={styles.header}>Categories</h2>
              <ul className={styles['categories-list']}>
                {categories.map(category => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    subCategories={subCategories}
                    activeCategoryButton={activeCategoryButton}
                    handleCategoryButton={handleCategoryButton}
                  />
                ))}
              </ul>
            </div>
            <div className={styles.sort}>
              <ul className={styles['sort-list']}></ul>
            </div>
          </div>
          <ul className={styles.products}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AllProducts;
