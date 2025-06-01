import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/catalog/product/productCard';
import type I_Product from '@/interfaces/catalog/product';
import type I_Category from '@/interfaces/catalog/category';
import type I_SubCategory from '@/interfaces/catalog/subCategory';
import styles from './allProducts.module.scss';
import createBreadCrumbs from '@/pages/allProducts/createBreadcrumbs';
import CategoryItem from '@/components/catalog/category-item/category-item';
import type I_SortedProduct from '@/interfaces/catalog/sortedProduct';
import getProductsData from '@/pages/allProducts/getProductsData';
import createProductData from '@/pages/allProducts/createProductData';
import getSortedProductsData from '@/pages/allProducts/getSortedProductsData';
import getCategoriesData from '@/pages/allProducts/getCategoriesData';
import getSearchData from '@/pages/allProducts/getSearchData';
import Sort from '@/components/catalog/sort/sort';

function AllProducts() {
  const [products, setProducts] = useState<I_Product[] | I_SortedProduct[]>([]);
  const [categories, setCategories] = useState<I_Category[]>([]);
  const [subCategories, setSubCategories] = useState<I_SubCategory[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);
  const [activeCategoryButton, setActiveCategoryButton] = useState<string | null>(null);
  const [sortPrice, setSortPrice] = useState<string | null>(null);
  const [sortName, setSortName] = useState<string | null>(null);

  useEffect(() => {
    if (!activeCategoryButton && !sortPrice && !sortName) {
      getProductsData({ setProducts });
    } else {
      getSortedProductsData({ activeCategoryButton, sortPrice, sortName, setProducts });
    }
  }, [activeCategoryButton, sortPrice, sortName]);

  useEffect(() => {
    getCategoriesData({ setCategories, setSubCategories });
  }, []);

  function handleCategoryButton(event: React.MouseEvent) {
    const target = event.target;

    if (target && target instanceof HTMLButtonElement) {
      const id = target.getAttribute('data-id');

      if (id) {
        setActiveCategoryButton(id);

        const breadcrumbs = createBreadCrumbs(categories, subCategories, id);

        setBreadcrumbs(breadcrumbs);
        getProductsData({ setProducts, id });
        // temp
        window.history.pushState(
          {},
          '',
          `/products/${encodeURIComponent(target.textContent ?? '')}`,
        );
      }
    }
  }

  function handleSortPriceButton(event: React.ChangeEvent<HTMLInputElement>) {
    setSortPrice(event.target.value);
  }

  function handleSortNameButton(event: React.ChangeEvent<HTMLInputElement>) {
    setSortName(event.target.value);
  }

  function handleSearchInput(event: React.KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }

    const target = event.target;

    if (target && target instanceof HTMLInputElement) {
      const text = target.value.trim();
      if (text) {
        getSearchData({ text, setProducts });
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
              onKeyDown={handleSearchInput}
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
            <Sort
              key={'sort'}
              handleSortPriceButton={handleSortPriceButton}
              sortPrice={sortPrice}
              handleSortNameButton={handleSortNameButton}
              sortName={sortName}
            />
          </div>
          <ul className={styles.products}>
            {products.map(product => {
              const productData = createProductData(product);
              return <ProductCard key={productData.id} product={productData} />;
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AllProducts;
