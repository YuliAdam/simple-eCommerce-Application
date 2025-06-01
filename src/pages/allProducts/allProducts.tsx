import {
  getProducts,
  getCategories,
  getSortedProducts,
  getProductsBySearch,
} from '@/services/productsController';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/catalog/product/productCard';
import type I_Product from '@/interfaces/catalog/product';
import type I_Category from '@/interfaces/catalog/category';
import type I_SubCategory from '@/interfaces/catalog/subCategory';
import styles from './allProducts.module.scss';
import createBreadCrumbs from '@/pages/allProducts/createBreadcrumbs';
import CategoryItem from '@/components/catalog/category-item/category-item';
import type I_SortedProduct from '@/interfaces/catalog/sortedProduct';
import type I_ProductCardData from '@/interfaces/catalog/productCard';

function AllProducts() {
  const [products, setProducts] = useState<I_Product[] | I_SortedProduct[]>([]);
  const [categories, setCategories] = useState<I_Category[]>([]);
  const [subCategories, setSubCategories] = useState<I_SubCategory[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);
  const [activeCategoryButton, setactiveCategoryButton] = useState<string | null>(null);
  const [sortPrice, setsortPrice] = useState<string | null>(null);
  const [sortName, setsortName] = useState<string | null>(null);

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

  useEffect(() => {
    async function getSortedProductsData() {
      try {
        const response = await getSortedProducts({
          categoryId: activeCategoryButton,
          sortByPrice: sortPrice,
          sortByName: sortName,
        });

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;
          setProducts(productsData);
          console.log('SortedProducts: ', productsData);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (!activeCategoryButton && !sortPrice && !sortName) {
      getProductsData();
    } else {
      getSortedProductsData();
    }
  }, [activeCategoryButton, sortPrice, sortName]);

  useEffect(() => {
    async function getCategoriesData() {
      try {
        const response = await getCategories();

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
            const response = await getProducts({ categoryId: id });

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

  function handleSortPriceButton(event: React.ChangeEvent<HTMLInputElement>) {
    setsortPrice(event.target.value);
  }

  function handleSortNameButton(event: React.ChangeEvent<HTMLInputElement>) {
    setsortName(event.target.value);
  }

  function createProductData(productData: I_Product | I_SortedProduct): I_ProductCardData {
    if ('masterData' in productData) {
      return {
        id: productData.id,
        name: productData.masterData.current.name?.['en-GB'],
        description: productData.masterData.current.description?.['en-GB'],
        images: productData.masterData.current.masterVariant?.images,
        prices: productData.masterData.current.masterVariant?.prices,
      };
    } else {
      return {
        id: productData.id,
        name: productData.name?.['en-GB'],
        description: productData.description?.['en-GB'],
        images: productData.masterVariant?.images,
        prices: productData.masterVariant?.prices,
      };
    }
  }

  function handleSearchInput(event: React.KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }

    const target = event.target;

    if (target && target instanceof HTMLInputElement) {
      const text = target.value.trim();
      if (text) {
        async function getSearchData(text: string) {
          try {
            const response = await getProductsBySearch(text);

            if (response && response.statusCode === 200) {
              const productsNames = response.body['searchKeywords.en-GB'].map(el => el.text);
              const productsData = await getProducts();

              if (productsData && productsData.statusCode === 200) {
                const products = productsData.body.results;

                const searchedProducts = products.filter(el =>
                  productsNames.includes(el.masterData.current.name['en-GB']),
                );
                setProducts(searchedProducts);
                console.log('Searched products: ', productsNames);
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
        getSearchData(text);
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
            <div className={styles.sort}>
              <h2 className={styles.header}>Sort</h2>
              <ul className={styles['sort-list']}>
                <li className={styles['sort-list-item']}>
                  <ul className={styles['sort-list-price']}>
                    <li className={styles['sort-list-price-item']}>
                      <h3>By price</h3>
                      <div className={styles['sort-list-button-wrapper']}>
                        <input
                          className={styles['sort-list-button']}
                          onChange={handleSortPriceButton}
                          checked={sortPrice === 'desc'}
                          type="radio"
                          id="sort-price-max"
                          name="price"
                          value="desc"
                        />
                        <label
                          className={styles['sort-list-button-label']}
                          htmlFor="sort-price-max"
                        >
                          Max price
                        </label>
                      </div>
                      <div className={styles['sort-list-button-wrapper']}>
                        <input
                          className={styles['sort-list-button']}
                          onChange={handleSortPriceButton}
                          checked={sortPrice === 'asc'}
                          type="radio"
                          id="sort-price-min"
                          name="price"
                          value="asc"
                        />
                        <label
                          className={styles['sort-list-button-label']}
                          htmlFor="sort-price-min"
                        >
                          Min price
                        </label>
                      </div>
                    </li>
                  </ul>
                </li>
                <li className={styles['sort-list-item']}>
                  <ul className={styles['sort-list-name']}>
                    <li className={styles['sort-list-name-item']}>
                      <h3>By name</h3>
                      <div className={styles['sort-list-button-wrapper']}>
                        <input
                          className={styles['sort-list-button']}
                          onChange={handleSortNameButton}
                          checked={sortName === 'asc'}
                          type="radio"
                          id="sort-name-az"
                          name="name"
                          value="asc"
                        />
                        <label className={styles['sort-list-button-label']} htmlFor="sort-name-az">
                          A-Z
                        </label>
                      </div>
                      <div className={styles['sort-list-button-wrapper']}>
                        <input
                          className={styles['sort-list-button']}
                          onChange={handleSortNameButton}
                          checked={sortName === 'desc'}
                          type="radio"
                          id="sort-name-za"
                          name="name"
                          value="desc"
                        />
                        <label className={styles['sort-list-button-label']} htmlFor="sort-name-za">
                          Z-A
                        </label>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
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
