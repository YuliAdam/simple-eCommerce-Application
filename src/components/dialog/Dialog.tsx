import type { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import styles from './dialog.module.scss';
import {
  setCode,
  setDialogText,
  toggleCodeForm,
  toggleDialog,
  validationCode,
} from '@/store/slices/dialogSlice';
import type { ChangeEvent } from 'react';
import { useEffect, useRef } from 'react';
import { Input } from '../user/Input';
import { IBasketUpdateActions, InputTypes } from '@/interfaces/types';
import { getBasket, updateBasket } from '@/services/basketController';
import { SHOP } from '@/config/localStorageConfig';
import type { CartUpdateAction } from '@commercetools/platform-sdk';
import { setTotalPrice } from '@/store/slices/basketSlice';

const CODE_NOT_FOUND_MESSAGE = "Applied code isn't valid. Apply a valid code.";

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
    dispatch(toggleCodeForm(false));
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  function changeCode() {
    return (event: ChangeEvent<HTMLInputElement> | undefined) => {
      if (event && event.target && event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        dispatch(setCode(value));
      }
    };
  }

  async function sendCode() {
    const basketId = localStorage.getItem(SHOP.client_cart_id);
    try {
      const basket = await getBasket(basketId);
      const actions: CartUpdateAction[] = [];
      actions.push({ action: IBasketUpdateActions.addDiscountCode, code: dialog.codeValue });
      if (basket) {
        const response = await updateBasket(basket.body.version, actions, basketId);
        response && dispatch(setTotalPrice(response.body.totalPrice.centAmount || 0));
        dispatch(validationCode(true));
        clickCloseDialog();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === `The discount code '${dialog.codeValue}' was not found.`) {
          dispatch(setDialogText(CODE_NOT_FOUND_MESSAGE));
          dispatch(toggleDialog(true));
        } else {
          dispatch(setDialogText(err.message));
          dispatch(toggleDialog(true));
        }
      }
    }
  }

  function getCodeForm() {
    return dialog.isCodeDialog ? (
      <>
        <div className={styles.input_wrap}>
          <Input
            value={dialog.codeValue}
            readOnly={false}
            className={styles.input}
            type={InputTypes.text}
            placeholder="code"
            onChange={changeCode()}
          />
        </div>
        <button className={styles.apply} onClick={sendCode}>
          Apply
        </button>
      </>
    ) : (
      ''
    );
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
          {getCodeForm()}
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
