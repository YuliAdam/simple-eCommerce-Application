import { Dot } from '@/assets/img/dot';
import { VARIANTS } from '@/interfaces/types';
import type { Product } from '@commercetools/platform-sdk';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../spinner/spinner';
import ImageModal from './components/modal/ImageModal';
import CustomSlider from './components/slider/productImageSlider';
import {
  getAllVariantImages,
  getAttributeValue,
  getAttributeValues,
  getLowestPrice,
  getVariantIdByAttributes,
  type Thumbnail,
} from './getProductData';
import styles from './productCard.module.scss';
import type { RootState } from '@/store/store';
import formatPrice from '@/utils/formatPrice';

function ProductDetailed({
  product,
  toggleInBasketEvent,
}: {
  product: Product;
  toggleInBasketEvent: (variantId: number | undefined) => {};
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInBasket, setIsInBasket] = useState<boolean>(false);
  const [variantId, setVariantIdState] = useState<number | undefined>(undefined);
  const [color, setColorState] = useState('');
  const [size, setSizeState] = useState('');
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);
  const basket = useSelector((state: RootState) => state.basket);

  useEffect(() => {
    setIsInBasket(
      !!basket.itemsId.find(item => item.id === product.id && item.variantId === variantId),
    );
  }, [variantId, basket.itemsId]);

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

  function setSize(newSize: string) {
    setSizeState(newSize);
    setVariantId(newSize, color);
  }

  function setColor(newColor: string) {
    setColorState(newColor);
    setVariantId(size, newColor);
  }

  function setVariantId(newSize: string, newColor: string) {
    let id = getVariantIdByAttributes(product.masterData.current.variants, {
      size: newSize,
      color: newColor,
    });
    if (!id) {
      id =
        getAttributeValue(product.masterData.current.masterVariant, VARIANTS.size) === newSize &&
        getAttributeValue(product.masterData.current.masterVariant, VARIANTS.color) === newColor
          ? product.masterData.current.masterVariant.id
          : undefined;
    }
    setVariantIdState(id);
  }

  function getButtonText() {
    if (!size || !color) {
      return 'Choose variant';
    }
    return !variantId ? 'Not available' : isInBasket ? 'Remove from cart' : 'Add to cart';
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
          onClick={() => toggleInBasketEvent(variantId)}
        >
          {getButtonText()}
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
