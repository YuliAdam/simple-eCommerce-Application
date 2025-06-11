import { Dot } from '@/assets/img/dot';
import type { CartUpdateAction, Product, ProductVariant } from '@commercetools/platform-sdk';
import { useState } from 'react';
import Spinner from '../spinner/spinner';
import ImageModal from './components/modal/ImageModal';
import CustomSlider from './components/slider/productImageSlider';
import styles from './productCard.module.scss';
import { IBasketUpdateActions } from '@/interfaces/types';
import { getBasket, updateBasket } from '@/services/basketController';
import { SHOP } from '@/config/localStorageConfig';
import { useDispatch } from 'react-redux';
import { setDialogText, toggleDialog } from '@/store/slices/dialogSlice';
import { changeTotalItems } from '@/store/slices/basketSlice';

type Thumbnail = {
  url: string;
  label: string;
};

function ProductDetailed({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [variantId, setVariantIdState] = useState<number | undefined>(undefined);
  const [color, setColorState] = useState('');
  const [size, setSizeState] = useState('');
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const dispatch = useDispatch();

  const getAttributeValues = (variants: ProductVariant[], name: string): string[] => {
    if (!variants?.length) return [];
    const values = variants
      .map(variant => variant.attributes?.find(attribute => attribute.name === name)?.value?.key)
      .filter((key): key is string => key !== undefined);
    return [...new Set(values)];
  };

  const getAllVariantImages = (variants: ProductVariant[]): Thumbnail[] => {
    if (!variants?.length) return [];
    return variants.flatMap(variant =>
      (variant.images ?? []).map(img => ({
        url: img.url,
        label: img.label || `product image`,
      })),
    );
  };

  const getLowestPrice = (variants: ProductVariant[]): { amount: number; currency: string } => {
    if (!variants?.length) return { amount: 0, currency: '' };
    const prices = variants.flatMap(variant =>
      (variant.prices ?? []).map(product => product.value),
    );
    if (!prices.length) return { amount: 0, currency: '' };
    const lowestPrice = prices.reduce(
      (min, price) => (price.centAmount < min.centAmount ? price : min),
      prices[0],
    );
    return { amount: lowestPrice.centAmount, currency: lowestPrice.currencyCode };
  };

  const productName = product.masterData.current.name,
    productDescription = product.masterData.current.description,
    rawVariants = product.masterData.current.variants ?? [];

  const productVariants = rawVariants;
  const allVariants = [product.masterData.current.masterVariant, ...productVariants];

  const productBrand = getAttributeValues(allVariants, 'brand');
  const productSize = getAttributeValues(allVariants, 'size');
  const productColor = getAttributeValues(allVariants, 'color');

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

  async function addProductInBasket() {
    try {
      const id =
        localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);
      const basket = await getBasket(id);
      if (basket) {
        dispatch(changeTotalItems(+1));
        const actions: CartUpdateAction[] = [
          { action: IBasketUpdateActions.addLineItem, productId: product.id, variantId: variantId },
        ];
        await updateBasket(basket.body.version, actions, id);
      }
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setDialogText(err.message));
        dispatch(toggleDialog(true));
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
    const id = product.masterData.current.variants.find(
      variant =>
        newSize === variant.attributes?.find(attr => attr.name === 'size')?.value.key &&
        newColor === variant.attributes?.find(attr => attr.name === 'color')?.value.key,
    )?.id;
    setVariantIdState(id);
  }

  return (
    <div className={styles['productDetailedContainer']}>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '60vw' }}
      >
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
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}></div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <p style={{ fontSize: '2.2rem' }} className={styles['product-name']}>
          {productName ? productName['en-GB'] : ''}
        </p>
        <p
          style={{ textTransform: 'capitalize', fontSize: '1.9rem', color: 'gray' }}
          className={styles['product-description']}
        >
          {productBrand ? productBrand : ''}
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!productDiscount ? (
            <p style={{ fontSize: '1.9rem' }} className={styles['product-description']}>
              {`${productPrice / 100} ${productCurrency}`}
            </p>
          ) : (
            <>
              <p style={{ fontSize: '1.9rem' }} className={styles['product-description']}>
                {productDiscount ? `${productDiscount / 100} ${productCurrency}` : ''}
              </p>
              <p
                className={styles['product-description']}
                style={{ color: 'gray', textDecoration: 'line-through', fontSize: '1.9rem' }}
              >
                {`${productPrice / 100} ${productCurrency}`}
              </p>
            </>
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
                  style={{ textTransform: 'uppercase', fontSize: '1.9rem', cursor: 'pointer' }}
                  className={`${styles['product-description']} ${size === paragraph ? styles.active : ''}`}
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
          className={styles['product_add']}
          disabled={!variantId}
          onClick={addProductInBasket}
        >
          Add to cart
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
