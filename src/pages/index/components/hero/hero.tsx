import { Link } from 'react-router-dom';
import styles from './hero.module.scss';
import { Path } from '@/config/routesConfig';

enum PROMOCODES {
  SAVE20 = 'SAVE20',
  RSSCHOOL10 = 'RSSCHOOL10',
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          modern
          <br />
          clothes
        </h1>
        <Link to={Path.allProducts} className={styles.subtitle}>
          &gt; let's buy something
        </Link>
        <div className={styles.promocodesContainer}>
          <h2>promocodes:</h2>
          <p className={styles.promocodes}>
            Buy more then two items and get 20% -{' '}
            <span className={styles.highlight}>{PROMOCODES.SAVE20}</span>
          </p>
          <p className={styles.promocodes}>
            Discount 10% by RSSchool -{' '}
            <span className={styles.highlight}>{PROMOCODES.RSSCHOOL10}</span>
          </p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img className={styles.heroImage} src="/clot.jpeg" />
      </div>
    </section>
  );
}
