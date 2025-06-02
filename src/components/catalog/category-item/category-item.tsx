import styles from './category-item.module.scss';
import type I_CategoryItemProps from '@/interfaces/catalog/categoryItem';

function CategoryItem({
  category,
  subCategories,
  activeCategoryButton,
  handleCategoryButton,
}: I_CategoryItemProps) {
  return (
    <li key={category.id} className={styles['categories-item']}>
      <button
        data-id={category.id}
        className={`${styles['categories-button']} ${activeCategoryButton === category.id ? styles['categories-button-active'] : ''}`}
        onClick={handleCategoryButton}
      >
        {category.name?.['en-GB'] ? category.name['en-GB'] : ''}
      </button>
      <ul className={styles['sub-categories-list']}>
        {subCategories.map(subCategory =>
          subCategory.parent?.id === category.id ? (
            <li key={subCategory.id} className={styles['sub-categories-item']}>
              <button
                data-id={subCategory.id}
                className={`${styles['sub-categories-button']} ${activeCategoryButton === subCategory.id ? styles['categories-button-active'] : ''}`}
                onClick={handleCategoryButton}
              >
                {subCategory.name?.['en-GB'] ? subCategory.name['en-GB'] : ''}
              </button>
            </li>
          ) : (
            ''
          ),
        )}
      </ul>
    </li>
  );
}

export default CategoryItem;
