import { Link } from 'react-router-dom';
import styles from './hero.module.scss';
import { Path } from '@/config/routesConfig';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          simple
          <br />
          clothes
        </h1>
        <Link to={Path.allProducts} className={styles.subtitle}>
          &gt; let's buy something
        </Link>
        <div className={styles.promocodesContainer}>
          <h2>promocodes:</h2>
          <p className={styles.promocodes}>xxx-xxx-xxx-xxx</p>
          <p className={styles.promocodes}>xxx-xxx-xxx-xxx</p>
          <p className={styles.promocodes}>xxx-xxx-xxx-xxx</p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <video
          preload="none"
          src="/indexVideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={styles.heroImage}
        />
      </div>
    </section>
  );
}
