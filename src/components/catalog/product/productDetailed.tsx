import { Dot } from '@/assets/img/dot';
import type { Product, ProductVariant as SDKProductVariant } from '@commercetools/platform-sdk';
import { useState } from 'react';
import Spinner from '../spinner/spinner';
import ImageModal from './components/modal/ImageModal';
import CustomSlider from './components/slider/productImageSlider';
import styles from './productCard.module.scss';

type Thumbnail = {
  url: string;
  label: string;
};

function ProductDetailed({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  const getAttributeValues = (variants: SDKProductVariant[], name: string): string[] => {
    if (!variants?.length) return [];
    const values = variants
      .map(variant => variant.attributes?.find(attribute => attribute.name === name)?.value?.key)
      .filter((key): key is string => key !== undefined);
    return [...new Set(values)];
  };

  const getAllVariantImages = (variants: SDKProductVariant[]): Thumbnail[] => {
    if (!variants?.length) return [];
    return variants.flatMap(variant =>
      (variant.images ?? []).map(img => ({
        url: img.url,
        label: img.label || `product image`,
      })),
    );
  };

  const getLowestPrice = (variants: SDKProductVariant[]): { amount: number; currency: string } => {
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
                  className={styles['product-description']}
                  key={index}
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
              return <Dot stroke={paragraph} key={index} />;
            })
          ) : (
            <Spinner />
          )}
        </div>
        <button
          style={{
            border: 'transparent 1px solid',
            borderRadius: '2px',
            padding: '1rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
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
