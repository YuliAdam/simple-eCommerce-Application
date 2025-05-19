import { Link } from 'react-router-dom';
import { Path } from '@config/routesConfig';
import styles from '@components/footer/footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      footer
      <Link to={Path.empty}> test spa: back to index </Link>
    </footer>
  );
}
