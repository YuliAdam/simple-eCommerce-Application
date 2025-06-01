import styles from './sort.module.scss';
import type I_SortProps from '@/interfaces/catalog/sort';

function Sort({ handleSortPriceButton, sortPrice, handleSortNameButton, sortName }: I_SortProps) {
  return (
    <div className={styles.sort}>
      <h2 className={styles.header}>Sort</h2>
      <ul className={styles['sort-list']}>
        <li className={styles['sort-list-item']}>
          <ul className={styles['sort-list-price']}>
            <li className={styles['sort-list-price-item']}>
              <h3 className={styles['sub-header']}>By price</h3>
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
                <label className={styles['sort-list-button-label']} htmlFor="sort-price-max">
                  Price: High to Low
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
                <label className={styles['sort-list-button-label']} htmlFor="sort-price-min">
                  Price: Low to High
                </label>
              </div>
            </li>
          </ul>
        </li>
        <li className={styles['sort-list-item']}>
          <ul className={styles['sort-list-name']}>
            <li className={styles['sort-list-name-item']}>
              <h3 className={styles['sub-header']}>By name</h3>
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
  );
}

export default Sort;
