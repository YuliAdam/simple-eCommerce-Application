import type { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dialog.module.scss';
import { toggleDialog } from '@/store/slices/dialogSlice';
import { useEffect, useRef } from 'react';

export function Dialog() {
  const dialog = useSelector((state: RootState) => state.dialog.values);
  const dispatch = useDispatch();
  useEffect(() => {
    document.documentElement.classList.toggle('noscroll', dialog.isOpen);
    return () => document.documentElement.classList.remove('noscroll');
  }, [dialog.isOpen]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleBackgroundClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (dialogRef.current && e.target === dialogRef.current.firstChild) {
      clickCloseDialog();
    }
  }

  function clickCloseDialog() {
    dispatch(toggleDialog(false));
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  return (
    <dialog
      onClick={e => handleBackgroundClick(e)}
      ref={dialogRef}
      className={styles.dialog}
      open={dialog.isOpen}
    >
      <div className={styles.dialog_wrapper}>
        <div className={styles.dialog_text}>
          <p>{dialog.value}</p>
          <div className={styles.dialog_close}>
            <button className={styles.dialog_closeButton} onClick={clickCloseDialog}>
              close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
