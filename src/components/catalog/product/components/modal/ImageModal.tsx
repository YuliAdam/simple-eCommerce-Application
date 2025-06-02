import { type JSX, useCallback, useEffect } from 'react';
import CustomSlider from '../slider/productImageSlider';
import styles from './imageModal.module.scss';

interface I_ImageModalProps {
  isOpen: boolean;
  images: Array<{ url: string; label?: string }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
}: I_ImageModalProps): JSX.Element | null {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    },
    [isOpen, onClose, onNext, onPrev],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add(styles.noscroll);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove(styles.noscroll);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const thumbnails = images.map(img => ({
    url: img.url,
    label: img.label || `product image`,
  }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <button className={styles.closeButton} onClick={onClose}>
        close
      </button>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <CustomSlider thumbnails={thumbnails} initialIndex={currentIndex}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.label || `product image ${index + 1}`}
              className={styles.modalImage}
            />
          ))}
        </CustomSlider>
      </div>
    </div>
  );
}

export default ImageModal;
