import type I_Category from '@/interfaces/catalog/category';
import type I_SubCategory from '@/interfaces/catalog/subCategory';

export default function createBreadCrumbs(
  categories: I_Category[],
  subCategories: I_SubCategory[],
  id: string,
): { id: string; name: string }[] {
  const breadcrumbs: { id: string; name: string }[] = [];

  const category = categories.find(el => el.id === id);
  const subCategory = subCategories.find(el => el.id === id);

  if (category) {
    const categoryName = category.name?.['en-GB'];
    if (categoryName) {
      breadcrumbs.push({
        id: category.id,
        name: categoryName,
      });
    }
  } else if (subCategory) {
    const category = categories.find(el => el.id === subCategory.parent?.id);
    const categoryName = category?.name?.['en-GB'];
    const subCategoryName = subCategory.name?.['en-GB'];

    if (categoryName) {
      breadcrumbs.push({
        id: subCategory?.parent?.id ?? '',
        name: categoryName ?? '',
      });
    }
    if (subCategoryName) {
      breadcrumbs.push({
        id: subCategory.id,
        name: subCategoryName,
      });
    }
  }

  return breadcrumbs;
}
