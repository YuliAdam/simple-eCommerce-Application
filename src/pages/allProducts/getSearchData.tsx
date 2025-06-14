import { getProductsBySearch, getProducts } from '@/services/productsController';
import type I_Product from '@/interfaces/catalog/product';
import type I_SortedProduct from '@/interfaces/catalog/sortedProduct';

export default async function getSearchData({
  text,
  setProducts,
  productsLimit,
  setIsOverload,
}: {
  text: string;
  setProducts: React.Dispatch<React.SetStateAction<I_Product[] | I_SortedProduct[]>>;
  productsLimit: number;
  setIsOverload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  try {
    const response = await getProductsBySearch(text);

    if (response && response.statusCode === 200) {
      const productsNames = response.body['searchKeywords.en-GB'].map(el => el.text);
      const productsData = await getProducts();

      if (productsData && productsData.statusCode === 200) {
        const products = productsData.body.results;

        const searchedProducts = products.filter(el =>
          productsNames.includes(el.masterData.current.name['en-GB']),
        );

        const limitedProducts = searchedProducts.slice(0, productsLimit);

        if (productsLimit >= searchedProducts.length) {
          setIsOverload(true);
        }

        setProducts(limitedProducts);
        console.log('Searched products: ', response, productsNames);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
