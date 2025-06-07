import type I_Category from '@/interfaces/catalog/category';
import styles from './category-item.module.scss';
import type I_SubCategory from '@/interfaces/catalog/subCategory';

interface I_CategoryItemProps {
  category: I_Category;
  subCategories: I_SubCategory[];
  activeCategoryButton: string | null;
  handleCategoryButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function CategoryItem({
  category,
  subCategories,
  activeCategoryButton,
  handleCategoryButton,
}: I_CategoryItemProps) {
  function getClassNameIfActive(id: string) {
    return activeCategoryButton === id ? styles['categories-button-active'] : '';
  }

  function getSubCategories() {
    const subCategoriesArr: React.JSX.Element[] = [];
    {
      subCategories.forEach(subCategory => {
        if (subCategory.parent?.id === category.id) {
          subCategoriesArr.push(
            <li key={subCategory.id} className={styles['sub-categories-item']}>
              <button
                data-id={subCategory.id}
                className={`${styles['categories-button']} ${getClassNameIfActive(subCategory.id)}`}
                onClick={handleCategoryButton}
              >
                {subCategory.name?.['en-GB'] || ''}
              </button>
            </li>,
          );
        }
      });
    }
    return subCategoriesArr;
  }

  return (
    <li key={category.id} className={styles['categories-item']}>
      <button
        data-id={category.id}
        className={`${styles['categories-button']} ${getClassNameIfActive(category.id)}`}
        onClick={handleCategoryButton}
      >
        {category.name?.['en-GB'] || ''}
      </button>
      <ul className={styles['sub-categories-list']}>{...getSubCategories()}</ul>
    </li>
  );
}

export default CategoryItem;
