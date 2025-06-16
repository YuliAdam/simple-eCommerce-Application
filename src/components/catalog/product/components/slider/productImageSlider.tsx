import { type JSX, useEffect, useState } from 'react';

import { ArrowLeft } from '@/assets/img/arrowLeft';
import { ArrowRight } from '@/assets/img/arrowRight';
import React from 'react';
import styles from './productImageSlider.module.scss';

type Thumbnail = {
  url: string;
  label?: string;
};

type SliderProps = {
  children: React.ReactNode;
  thumbnails: Thumbnail[] | null;
  initialIndex?: number;
};

function CustomSlider({ children, thumbnails, initialIndex = 0 }: SliderProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const slideNext = (): void => {
    setActiveIndex(value => {
      if (thumbnails && value >= thumbnails.length - 1) {
        return 0;
      }
      return value + 1;
    });
  };
  const slidePrev = (): void => {
    setActiveIndex(value => {
      if (value <= 0) {
        return thumbnails ? thumbnails.length - 1 : -1;
      }
      return value - 1;
    });
  };

  return (
    <>
      <div className={styles['containerSlider']}>
        {React.Children.map(children, (child, index) => {
          return (
            <div
              className={`${styles.sliderItem} }`}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              key={index}
            >
              {child}
            </div>
          );
        })}
        <button
          className={styles['sliderButtonNext']}
          onClick={e => {
            e.preventDefault();
            slideNext();
          }}
        >
          <ArrowLeft stroke="#4b5563" />
        </button>
        <button
          className={styles['sliderButtonPrev']}
          onClick={e => {
            e.preventDefault();
            slidePrev();
          }}
        >
          <ArrowRight stroke="#4b5563" />
        </button>
      </div>
      <div className={styles['containerSliderLinks']}>
        {thumbnails
          ? thumbnails.map((thumbnail, index) => (
              <button
                key={index}
                style={{ cursor: 'pointer' }}
                className={
                  activeIndex === index
                    ? `${styles['containerSliderLinksSmallActive']}`
                    : `${styles['containerSliderLinksSmall']}`
                }
                onClick={e => {
                  e.preventDefault();
                  setActiveIndex(index);
                }}
              >
                <img
                  className={activeIndex === index ? `${styles['imgActive']}` : ''}
                  src={thumbnail.url}
                  alt={thumbnail.label}
                />
              </button>
            ))
          : ''}
      </div>
    </>
  );
}

export default CustomSlider;
