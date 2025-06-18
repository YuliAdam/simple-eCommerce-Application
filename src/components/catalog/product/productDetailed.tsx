import { Dot } from '@/assets/img/dot';
import { SHOP } from '@/config/localStorageConfig';
import { IBasketUpdateActions, VARIANTS } from '@/interfaces/types';
import { getBasket, updateBasket } from '@/services/basketController';
import {
  addItemsId,
  changeTotalItems,
  setItemsId,
  setTotalItems,
} from '@/store/slices/basketSlice';
import { openDialogWithMessage } from '@/store/slices/dialogSlice';
import type { CartUpdateAction, Product } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../spinner/spinner';
import ImageModal from './components/modal/ImageModal';
import CustomSlider from './components/slider/productImageSlider';
import {
  getAllVariantImages,
  getAttributeValues,
  getLowestPrice,
  type Thumbnail,
} from './getProductData';
import styles from './productCard.module.scss';
import type { RootState } from '@/store/store';
import createItemsIdArr from '@/utils/createItemsIdArr';
import formatPrice from '@/utils/formatPrice';

function ProductDetailed({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInBasket, setIsInBasket] = useState<boolean>(false);
  const [variantId, setVariantIdState] = useState<number | undefined>(undefined);
  const [color, setColorState] = useState('');
  const [size, setSizeState] = useState('');
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const dispatch = useDispatch();
  const basket = useSelector((state: RootState) => state.basket);

  useEffect(() => {
    setIsInBasket(
      !!basket.itemsId.find(item => item.id === product.id && item.variantId === variantId),
    );
  }, [variantId]);

  const productName = product.masterData.current.name,
    productDescription = product.masterData.current.description,
    rawVariants = product.masterData.current.variants ?? [];

  const productVariants = rawVariants;
  const allVariants = [product.masterData.current.masterVariant, ...productVariants];

  const productBrand = getAttributeValues(allVariants, VARIANTS.brand);
  const productSize = getAttributeValues(allVariants, VARIANTS.size);
  const productColor = getAttributeValues(allVariants, VARIANTS.color);

  const { amount: productPrice, currency: productCurrency } = getLowestPrice(allVariants);
  const productDiscount =
    product.masterData.current.masterVariant.prices?.[0]?.discounted?.value?.centAmount;

  const combinedImages: Thumbnail[] = getAllVariantImages(allVariants);

  const handleImageClick = (index: number): void => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  const handleModalNext = (): void => {
    setModalImageIndex(prevIndex => (prevIndex + 1) % combinedImages.length);
  };

  const handleModalPrev = (): void => {
    setModalImageIndex(
      prevIndex => (prevIndex - 1 + combinedImages.length) % combinedImages.length,
    );
  };

  async function toggleProductInBasket() {
    const id =
      localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
    try {
      const basket = await getBasket(id);
      if (basket) {
        if (isInBasket) {
          let lineItem = basket.body.lineItems.find(
            item => item.productId === product.id && item.variant.id === variantId,
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
            setIsInBasket(false);
          }
        } else {
          dispatch(changeTotalItems(+1));
          const actions: CartUpdateAction[] = [
            {
              action: IBasketUpdateActions.addLineItem,
              productId: product.id,
              variantId: variantId,
            },
          ];
          await updateBasket(basket.body.version, actions, id);
          setIsInBasket(true);
          if (variantId) {
            dispatch(addItemsId({ id: product.id, variantId: variantId }));
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(openDialogWithMessage(err.message));
      }
    }
  }

  function setSize(newSize: string) {
    setSizeState(newSize);
    setVariantId(newSize, color);
  }

  function setColor(newColor: string) {
    setColorState(newColor);
    setVariantId(size, newColor);
  }

  function setVariantId(newSize: string, newColor: string) {
    let id = product.masterData.current.variants.find(
      variant =>
        newSize === variant.attributes?.find(attr => attr.name === VARIANTS.size)?.value.key &&
        newColor === variant.attributes?.find(attr => attr.name === VARIANTS.color)?.value.key,
    )?.id;
    const isMaster =
      product.masterData.current.masterVariant.attributes?.find(attr => attr.name === VARIANTS.size)
        ?.value.key === newSize &&
      product.masterData.current.masterVariant.attributes?.find(
        attr => attr.name === VARIANTS.color,
      )?.value.key === newColor;
    if (isMaster) {
      id = product.masterData.current.masterVariant.id;
    }
    setVariantIdState(id);
  }

  function getButtonText() {
    if (!size || !color) {
      return 'Choose variant';
    }
    return !variantId ? 'Not available' : 'Add to cart';
  }

  return (
    <div className={styles['productDetailedContainer']}>
      <div className={styles['sliderContainer']}>
        <CustomSlider thumbnails={combinedImages}>
          {combinedImages ? (
            combinedImages.map((image, index) => {
              return (
                <img
                  className={styles['product-img']}
                  key={index}
                  src={image.url}
                  alt={image.label || `product image ${index + 1}`}
                  onClick={() => handleImageClick(index)}
                  style={{
                    cursor: 'pointer',
                    width: '445px',
                    height: '445px',
                    objectFit: 'contain',
                  }}
                />
              );
            })
          ) : (
            <Spinner />
          )}
        </CustomSlider>
      </div>

      <div className={styles['detailsContainer']}>
        <p style={{ fontSize: '2.2rem' }} className={styles['product-name']}>
          {productName ? productName['en-GB'] : ''}
        </p>
        <p
          style={{ textTransform: 'capitalize', fontSize: '1.9rem', color: 'gray' }}
          className={styles['product-description']}
        >
          {productBrand || ''}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <p style={{ fontSize: '1.9rem' }} className={styles['product-description']}>
            {productDiscount
              ? `${formatPrice(productDiscount)} ${productCurrency}`
              : `${formatPrice(productPrice)} ${productCurrency}`}
          </p>
          {productDiscount && (
            <p
              className={styles['product-description']}
              style={{ color: 'gray', textDecoration: 'line-through', fontSize: '1.9rem' }}
            >
              {`${formatPrice(productPrice)} ${productCurrency}`}
            </p>
          )}
        </div>
        <div
          className={styles['product-description']}
          style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '1.9rem' }}
        >
          Size:
          {productSize ? (
            productSize.map((paragraph, index) => {
              return (
                <span
                  className={`${styles['product-description']}  ${styles['product-size']} ${size === paragraph ? styles.active : ''}`}
                  key={index}
                  onClick={() => setSize(paragraph)}
                >
                  {paragraph}
                </span>
              );
            })
          ) : (
            <Spinner />
          )}
        </div>
        <div
          className={styles['product-description']}
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
            maxWidth: '200px',
            fontSize: '1.9rem',
          }}
        >
          Color:
          {productColor ? (
            productColor.map((paragraph, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setColor(paragraph);
                  }}
                >
                  <Dot
                    className={color === paragraph ? styles.active_color : ''}
                    stroke={paragraph}
                  />
                </div>
              );
            })
          ) : (
            <Spinner />
          )}
        </div>
        <button
          className={`${styles.product_add} ${isInBasket ? styles.animation : ''}`}
          disabled={!variantId}
          onClick={toggleProductInBasket}
        >
          {isInBasket ? 'Remove from cart' : getButtonText()}
        </button>
        <p style={{ fontSize: '1.9rem' }} className={styles['product-description']}>
          {productDescription && productName ? productDescription['en-GB'] : ''}
        </p>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        images={combinedImages}
        currentIndex={modalImageIndex}
        onNext={handleModalNext}
        onPrev={handleModalPrev}
      />
    </div>
  );
}

export default ProductDetailed;
