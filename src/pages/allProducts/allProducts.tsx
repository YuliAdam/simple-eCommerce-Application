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
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [checkboxFilters, setCheckboxFilters] = useState<{ name: string; value: string[] }[]>([]);

  useEffect(() => {
    if (
      !activeCategoryButton &&
      !sortPrice &&
      !sortName &&
      !minPrice &&
      !maxPrice &&
      !checkboxFilters
    ) {
      getProductsData({ setProducts });
    } else {
      getSortedProductsData({
        activeCategoryButton,
        sortPrice,
        sortName,
        setProducts,
        minPrice,
        maxPrice,
        checkboxFilters,
      });
    }
  }, [activeCategoryButton, sortPrice, sortName, minPrice, maxPrice, checkboxFilters]);

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

  function handleMinPriceInput(event: React.ChangeEvent<HTMLInputElement>) {
    const price = parseFloat(event.target.value);
    console.log('Min price ' + price);
    setMinPrice(price);
  }

  function handleMaxPriceInput(event: React.ChangeEvent<HTMLInputElement>) {
    const price = parseFloat(event.target.value);
    console.log('Max price ' + price);
    setMaxPrice(price);
  }

  function handleCheckboxFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;

    if (target && target instanceof HTMLInputElement) {
      const isChecked = target.checked;

      const filterOptions = {
        name: target.name,
        value: [target.value],
      };

      if (isChecked) {
        setCheckboxFilters(checkboxFilters => {
          const filters = checkboxFilters ? [...checkboxFilters] : [];
          const currentFilter = filters.find(filter => filter.name === filterOptions.name);

          if (currentFilter) {
            const copyCurrentFilter = { ...currentFilter };
            const newValues = [...copyCurrentFilter.value];

            filterOptions.value.forEach(filterValue => {
              if (!newValues.includes(filterValue)) {
                newValues.push(filterValue);
              }
            });

            copyCurrentFilter.value = newValues;

            const newFilters = filters.map(filter => {
              if (filter.name === filterOptions.name) {
                return copyCurrentFilter;
              } else {
                return filter;
              }
            });

            console.log('Checked. Updated filters: ', newFilters);
            return newFilters;
          } else {
            const newFilter = [...filters, filterOptions];
            console.log('Checked. New filter: ', newFilter);
            return newFilter;
          }
        });
      } else {
        setCheckboxFilters(checkboxFilters => {
          const filters = checkboxFilters ? [...checkboxFilters] : [];
          const currentFilter = filters.find(filter => filter.name === filterOptions.name);

          if (currentFilter) {
            const copyCurrentFilter = { ...currentFilter };
            let newValues = [...copyCurrentFilter.value];

            newValues = newValues.filter(filterValue => {
              if (filterValue !== filterOptions.value[0]) {
                return filterValue;
              }
            });

            if (newValues.length === 0) {
              return filters.filter(filter => filter.name !== filterOptions.name);
            } else {
              copyCurrentFilter.value = newValues;

              const newFilters = filters.map(filter => {
                if (filter.name === filterOptions.name) {
                  return copyCurrentFilter;
                } else {
                  return filter;
                }
              });

              console.log('Unchecked. Updated filters: ', newFilters);
              return newFilters;
            }
          } else {
            console.log('Unchecked. Filters: ', filters);
            return filters;
          }
        });
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
            {/* temp hardcode, need dynamic build for filters */}
            <div className={styles['price-filter']}>
              <h2 className={styles.header}>Filters</h2>
              <h3>Price range</h3>
              <ul>
                <li>
                  <label htmlFor="min-price">Minimum Price</label>
                  <input
                    onChange={handleMinPriceInput}
                    className={styles['price-input']}
                    type="number"
                    id="min-price"
                    min="0"
                    placeholder="Min: 0"
                  ></input>
                </li>
                <li>
                  <label htmlFor="max-price">Maximum Price</label>
                  <input
                    onChange={handleMaxPriceInput}
                    className={styles['price-input']}
                    type="number"
                    id="max-price"
                    max="30"
                    placeholder="Max: 30"
                  ></input>
                </li>
              </ul>
            </div>
            <div className={styles['attributes-filter']}>
              <h3>Brand</h3>
              <ul>
                <li>
                  <label htmlFor="gucci">Gucci</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="gucci"
                    name="brand"
                    value="gucci"
                  ></input>
                </li>
                <li>
                  <label htmlFor="prada">Prada</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="prada"
                    name="brand"
                    value="prada"
                  ></input>
                </li>
                <li>
                  <label htmlFor="carden">Carden</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="carden"
                    name="brand"
                    value="carden"
                  ></input>
                </li>
              </ul>
              <h4>Color</h4>
              <ul>
                <li>
                  <label htmlFor="black">Black</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="black"
                    name="color"
                    value="black"
                  ></input>
                </li>
                <li>
                  <label htmlFor="white">White</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="white"
                    name="color"
                    value="white"
                  ></input>
                </li>
              </ul>
              <h4>Size</h4>
              <ul>
                <li>
                  <label htmlFor="s">Small</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="s"
                    name="size"
                    value="s"
                  ></input>
                </li>
                <li>
                  <label htmlFor="m">Medium</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="m"
                    name="size"
                    value="m"
                  ></input>
                </li>
                <li>
                  <label htmlFor="l">Large</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="l"
                    name="size"
                    value="l"
                  ></input>
                </li>
                <li>
                  <label htmlFor="xl">Extra large</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="xl"
                    name="size"
                    value="xl"
                  ></input>
                </li>
                <li>
                  <label htmlFor="xxl">Extra extra large</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="xxl"
                    name="size"
                    value="xxl"
                  ></input>
                </li>
                <li>
                  <label htmlFor="38">38</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="38"
                    name="size"
                    value="38"
                  ></input>
                </li>
                <li>
                  <label htmlFor="39">39</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="39"
                    name="size"
                    value="39"
                  ></input>
                </li>
                <li>
                  <label htmlFor="40">40</label>
                  <input
                    onChange={handleCheckboxFilter}
                    type="checkbox"
                    id="40"
                    name="size"
                    value="40"
                  ></input>
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
