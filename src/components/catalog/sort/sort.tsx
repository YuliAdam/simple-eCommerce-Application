import RadioSortInput from './radioSortInput';
import styles from './sort.module.scss';

interface I_SortProps {
  handleSortPriceButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortPrice: string | null;
  handleSortNameButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortName: string | null;
}

enum SortMode {
  ASC = 'asc',
  DESC = 'desc',
}

function Sort({ handleSortPriceButton, sortPrice, handleSortNameButton, sortName }: I_SortProps) {
  return (
    <div className={styles.sort}>
      <h2 className={styles.header}>Sort</h2>
      <ul className={styles['sort-list']}>
        <li className={styles['sort-list-item']}>
          <ul className={styles['sort-list-price']}>
            <li className={styles['sort-list-price-item']}>
              <h3 className={styles['sub-header']}>By price</h3>
              <RadioSortInput
                wrapClassName={styles['sort-list-button-wrapper']}
                inputClassName={styles['sort-list-button']}
                onChange={handleSortPriceButton}
                checked={sortPrice === SortMode.DESC}
                id="sort-price-max"
                name="price"
                value={SortMode.DESC}
                labelClassName={styles['sort-list-button-label']}
                text="Price: High to Low"
              />
              <RadioSortInput
                wrapClassName={styles['sort-list-button-wrapper']}
                inputClassName={styles['sort-list-button']}
                onChange={handleSortPriceButton}
                checked={sortPrice === SortMode.ASC}
                id="sort-price-min"
                name="price"
                value={SortMode.ASC}
                labelClassName={styles['sort-list-button-label']}
                text="Price: Low to High"
              />
            </li>
          </ul>
        </li>
        <li className={styles['sort-list-item']}>
          <ul className={styles['sort-list-name']}>
            <li className={styles['sort-list-name-item']}>
              <h3 className={styles['sub-header']}>By name</h3>
              <RadioSortInput
                wrapClassName={styles['sort-list-button-wrapper']}
                inputClassName={styles['sort-list-button']}
                onChange={handleSortNameButton}
                checked={sortName === SortMode.ASC}
                id="sort-name-az"
                name="name"
                value={SortMode.ASC}
                labelClassName={styles['sort-list-button-label']}
                text="A-Z"
              />
              <RadioSortInput
                wrapClassName={styles['sort-list-button-wrapper']}
                inputClassName={styles['sort-list-button']}
                onChange={handleSortNameButton}
                checked={sortName === SortMode.DESC}
                id="sort-name-za"
                name="name"
                value={SortMode.DESC}
                labelClassName={styles['sort-list-button-label']}
                text="Z-A"
              />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Sort;
