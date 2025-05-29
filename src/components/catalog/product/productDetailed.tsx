import type I_ProductDetailed from '@/interfaces/catalog/productDetailed.types';
import styles from './productCard.module.scss';
import { useState } from 'react';

function ProductDetailed({ product }: { product: I_ProductDetailed }) {
  //           src={imagesArray ? imagesArray[0].url : ''}
  //           alt={imagesArray ? imagesArray[0].label : ''}
  // TODO:image array, slider switch Image, under MainImage other Images
  const [currentImage, setCurrentImage] = useState(null);

  const imagesArray = product.masterData.current.masterVariant.images,
    productName = product.masterData.current.name,
    productDescription = product.masterData.current.description,
    productBrand = product.masterData.current.masterVariant.attributes[0].value.key,
    productSize = product.masterData.current.masterVariant.attributes[1].value.key,
    productColor = product.masterData.current.masterVariant.attributes[2].value.key,
    productPrice = product.masterData.current.masterVariant.prices[0].value.centAmount;

  console.log('product_body', product.masterData.current);
  // console.log('productBrand: ', productBrand);
  // console.log('productSize: ', productSize);
  // console.log('productColor: ', productColor);
  // console.log(product.masterData.current.masterVariant.prices[0].value.centAmount);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
      <div style={{ backgroundColor: 'antiquewhite' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <button
            style={{
              border: 'transparent 1px solid',
              padding: '1rem',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
          >
            slider left
          </button>
          <img
            src={imagesArray ? imagesArray[0].url : ''}
            alt={imagesArray ? imagesArray[0].label : ''}
            className={styles['product-img']}
          />
          <button
            style={{
              border: 'transparent 1px solid',
              padding: '1rem',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
          >
            slider right
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          {imagesArray.length > 1
            ? imagesArray.map((image, index) => (
                <img
                  // TODO: how to convert it to <Image/> component?
                  className={styles['product-img']}
                  key={index}
                  src={image.url}
                  alt={image.label || `product image ${index + 1}`}
                />
              ))
            : null}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          backgroundColor: 'antiquewhite',
        }}
      >
        <p className={styles['product-name']}>{productName ? productName['en-GB'] : ''}</p>
        <p className={styles['product-description']}>{productBrand ? productBrand : ''}</p>
        <p className={styles['product-description']}>
          {productPrice ? `${productPrice / 100} EUR` : ''}
        </p>
        <p className={styles['product-description']}>{productSize ? productSize : ''}</p>
        <p className={styles['product-description']}>{productColor ? productColor : ''}</p>
        <button
          style={{
            border: 'transparent 1px solid',
            padding: '1rem',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          Add to cart
        </button>
        <p className={styles['product-description']}>
          {productDescription && productName ? productDescription['en-GB'] : ''}
        </p>
      </div>
    </div>
  );
}

export default ProductDetailed;
