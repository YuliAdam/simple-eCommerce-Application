import { Link } from 'react-router-dom';
import styles from './hero.module.scss';
import { Path } from '@/config/routesConfig';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            simple
            <br />
            clothes
          </h1>
          <Link to={Path.allProducts} className={styles.subtitle}>
            &gt; let's buy something
          </Link>
        </div>
        <div className={styles.imageContainer}>
          <video
            src="/indexVideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
}
