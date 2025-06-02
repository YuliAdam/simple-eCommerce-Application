import type I_Category from '@/interfaces/catalog/category';
import type I_SubCategory from '@/interfaces/catalog/subCategory';

export default interface I_CategoryItemProps {
  category: I_Category;
  subCategories: I_SubCategory[];
  activeCategoryButton: string | null;
  handleCategoryButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
