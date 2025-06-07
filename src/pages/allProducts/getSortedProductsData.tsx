import { getSortedProducts } from '@/services/productsController';
import type I_Product from '@/interfaces/catalog/product';
import type I_SortedProduct from '@/interfaces/catalog/sortedProduct';

export default async function getSortedProductsData({
  activeCategoryButton,
  sortPrice,
  sortName,
  setProducts,
  minPrice = 0,
  maxPrice,
  checkboxFilters,
}: {
  activeCategoryButton: string | null;
  sortPrice: string | null;
  sortName: string | null;
  setProducts: React.Dispatch<React.SetStateAction<I_Product[] | I_SortedProduct[]>>;
  minPrice?: number | null;
  maxPrice?: number | null;
  checkboxFilters?: { name: string; value: string[] }[];
}) {
  try {
    const response = await getSortedProducts({
      categoryId: activeCategoryButton,
      sortByPrice: sortPrice,
      sortByName: sortName,
      minPrice: minPrice ?? 0,
      maxPrice: maxPrice ?? 30,
      checkboxFilters: checkboxFilters,
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
