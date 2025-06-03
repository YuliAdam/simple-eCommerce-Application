import type { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dialog.module.scss';
import { toggleDialog } from '@/store/slices/dialogSlice';
import { useRef } from 'react';

export function Dialog() {
  const dialog = useSelector((state: RootState) => state.dialog.values);
  const dispatch = useDispatch();
  dialog.isOpen
    ? document.documentElement.classList.add('noscroll')
    : document.documentElement.classList.remove('noscroll');

  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerElementRef = useRef<HTMLDivElement>(null);

  function closeDialog(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
    if (e.target !== innerElementRef.current) {
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
      onClick={e => closeDialog(e)}
      ref={dialogRef}
      className={styles.dialog}
      open={dialog.isOpen}
    >
      <div className={styles.dialog_wrapper}>
        <div ref={innerElementRef} className={styles.dialog_text}>
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
