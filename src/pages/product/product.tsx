import ProductDetailed from '@/components/catalog/product/productDetailed';
import Spinner from '@/components/catalog/spinner/spinner';
import { getProducts } from '@/services/productsController';
import type { CartUpdateAction, Product } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './product.module.scss';
import { SHOP } from '@/config/localStorageConfig';
import { getBasket, updateBasket } from '@/services/basketController';
import { IBasketUpdateActions } from '@/interfaces/types';
import { useDispatch } from 'react-redux';
import {
  addItemsId,
  changeTotalItems,
  setItemsId,
  setTotalItems,
} from '@/store/slices/basketSlice';
import createItemsIdArr from '@/utils/createItemsIdArr';
import { openDialogWithMessage } from '@/store/slices/dialogSlice';

function Product() {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts();

        if (response && response.statusCode === 200) {
          const productsData = response.body.results;
          const productId = params.id;
          const foundProduct = productsData.find(product => product.id === productId);

          if (foundProduct) {
            setCurrentProduct(foundProduct);
            setTitle(foundProduct?.masterData?.current?.name?.['en-GB'] ?? '');
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  async function toggleProductInBasket(productId: string, variantId: number | undefined) {
    const id =
      localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
    try {
      const basket = await getBasket(id);
      if (basket) {
        const isInBasket = basket.body.lineItems.find(
          lineItem => lineItem.productId === productId && lineItem.variant.id === variantId,
        );
        if (isInBasket) {
          let lineItem = basket.body.lineItems.find(
            item => item.productId === productId && item.variant.id === variantId,
          );
          if (lineItem) {
            const actions: CartUpdateAction[] = [
              {
                action: IBasketUpdateActions.changeLineItemQuantity,
                lineItemId: lineItem.id,
                quantity: 0,
              },
            ];
            const response = await updateBasket(basket.body.version, actions, id);
            if (response) {
              dispatch(setTotalItems(response.body.totalLineItemQuantity || 0));
              dispatch(setItemsId(createItemsIdArr(response)));
            }
          }
        } else {
          dispatch(changeTotalItems(1));
          const actions: CartUpdateAction[] = [
            {
              action: IBasketUpdateActions.addLineItem,
              productId: productId,
              variantId: variantId,
            },
          ];
          await updateBasket(basket.body.version, actions, id);
          if (variantId) {
            dispatch(addItemsId({ id: productId, variantId: variantId }));
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(openDialogWithMessage(err.message));
      }
    }
  }

  return (
    <div className={styles.container}>
      <title>{`Product: ${title || 'not found'}`}</title>
      {!currentProduct ? (
        <p style={{ fontSize: '1.9rem', color: 'gray' }}>
          Product not found. Please check the product ID.
        </p>
      ) : (
        <ProductDetailed
          key={currentProduct.id}
          product={currentProduct}
          toggleInBasketEvent={(variantId: number | undefined) =>
            toggleProductInBasket(currentProduct.id, variantId)
          }
        />
      )}
    </div>
  );
}

export default Product;
