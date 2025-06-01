import type I_Product from '@/interfaces/catalog/product';
import type I_SortedProduct from '@/interfaces/catalog/sortedProduct';

import { getProducts } from '@/services/productsController';

export default async function getProductsData({
  setProducts,
  id,
}: {
  setProducts: React.Dispatch<React.SetStateAction<I_Product[] | I_SortedProduct[]>>;
  id?: string;
}) {
  try {
    const response = await getProducts();

    if (response && response.statusCode === 200) {
      const productsData = response.body.results;
      setProducts(productsData);
      if (id) {
        console.log('Products: ', productsData);
      } else {
        console.log('Products by category: ', productsData);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
