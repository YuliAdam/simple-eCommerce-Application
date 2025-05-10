import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.scss';

export function Header(): ReactElement {
  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav}>
          <ul className={styles['nav-list']}>
            <li>
              <Link className={styles['nav-link']} to="/product">
                Catalog
              </Link>
            </li>
            <li>
              <Link className={styles['nav-link']} to="/about">
                About
              </Link>
            </li>
          </ul>
          <ul className={styles['nav-list']}>
            <li>
              <Link className={styles['nav-link']} to="/registration">
                Register
              </Link>
            </li>
            <li>
              <Link className={styles['nav-link']} to="/login">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
