import styles from './spinner.module.scss';
export function Spinner() {
  return (
    <div className={styles.container}>
      <span className={styles.element}></span>
      <span className={styles.element}></span>
      <span className={styles.element}></span>
    </div>
  );
}
export default Spinner;
