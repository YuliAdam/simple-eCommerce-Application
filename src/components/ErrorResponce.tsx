import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import styles from '@/layout/error.module.scss';

//TODO: Integrate component in structure
// (if response have some errors errorSlise => isErrore set true => message set as value => dialog is open )

export function ErrorResponse() {
  const error = useSelector((state: RootState) => state.error.values);
  return (
    <dialog className={styles.error} open={error.isError ? true : false}>
      <p className={styles.error_text}>{error.value}</p>
      <button>Close</button>
    </dialog>
  );
}
