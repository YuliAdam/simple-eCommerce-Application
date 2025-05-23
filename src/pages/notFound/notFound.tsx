import { Link } from 'react-router-dom';
import styles from './notFound.module.scss';
import { Path } from '@/config/routesConfig';
export function NotFound({ error }: { error: string }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.label}>Error: {error}</p>
      <Link className={styles.link} to={Path.empty}>
        {' '}
        Return to index page
      </Link>
    </div>
  );
}
