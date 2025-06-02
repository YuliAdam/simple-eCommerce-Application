import { getCategories } from '@/services/productsController';
import type I_Category from '@/interfaces/catalog/category';
import type I_SubCategory from '@/interfaces/catalog/subCategory';

export default async function getCategoriesData({
  setCategories,
  setSubCategories,
}: {
  setCategories: React.Dispatch<React.SetStateAction<I_Category[]>>;
  setSubCategories: React.Dispatch<React.SetStateAction<I_SubCategory[]>>;
}) {
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
