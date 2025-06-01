import type I_Product from '@/interfaces/catalog/product';
import type I_SortedProduct from '@/interfaces/catalog/sortedProduct';
import type I_ProductCardData from '@/interfaces/catalog/productCard';

export default function createProductData(
  productData: I_Product | I_SortedProduct,
): I_ProductCardData {
  if ('masterData' in productData) {
    return {
      id: productData.id,
      name: productData.masterData.current.name?.['en-GB'],
      description: productData.masterData.current.description?.['en-GB'],
      images: productData.masterData.current.masterVariant?.images,
      prices: productData.masterData.current.masterVariant?.prices,
    };
  } else {
    return {
      id: productData.id,
      name: productData.name?.['en-GB'],
      description: productData.description?.['en-GB'],
      images: productData.masterVariant?.images,
      prices: productData.masterVariant?.prices,
    };
  }
}
