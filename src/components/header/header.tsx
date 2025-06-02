import { Logo } from '@/assets/img/logo';
import { Path } from '@/config/routesConfig';
import { login, logout } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { BurgerMenu } from '@assets/img/burger-menu';
import { ShoppingCart } from '@assets/img/cart';
import { User } from '@assets/img/user';
import { SHOP } from '@config/localStorageConfig';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.scss';
import { Login } from '@/assets/img/login';

export function Header() {
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  isMenuOpen
    ? document.documentElement.classList.add('noscroll')
    : document.documentElement.classList.remove('noscroll');

  useEffect(() => {
    const authToken = localStorage.getItem(SHOP?.client_token);
    if (authToken) {
      dispatch(login(authToken));
    }
  });

  function handleLogout() {
    localStorage.removeItem(SHOP?.client_token);
    localStorage.removeItem(SHOP?.client_id);
    dispatch(logout());
    navigate(Path.login);
    setIsMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <button
        ref={burgerBtnRef}
        className={`${styles['mobile-menu-button']} ${isMenuOpen ? styles.active : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <BurgerMenu />
      </button>
      <div
        ref={navLinksRef}
        className={`${styles['nav-links']} ${isMenuOpen ? styles.active : ''}`}
      >
        <nav
          onClick={e => {
            if (e.target instanceof HTMLAnchorElement) setIsMenuOpen(false);
          }}
        >
          <ul>
            <li className={styles.linkCatalog}>
              <Link to={Path.allProducts}>Catalog</Link>
            </li>
            <li className={styles.linkAbout}>
              <Link to={Path.about}>About</Link>
            </li>
            {isAuthorized && (
              <li style={{ display: 'flex' }} className={styles.linkLogout}>
                <button className={styles.buttonLogout} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <Link className={styles.logo} to={Path.empty}>
        <Logo />
      </Link>

      <div className={styles['header-actions']}>
        {!isAuthorized ? (
          <Link to={Path.login} className={styles['icon-button']}>
            <Login />
          </Link>
        ) : (
          <Link to={Path.user} className={styles['icon-button']}>
            <User />
          </Link>
        )}
        <Link to={Path.basket} className={styles['icon-button']}>
          <ShoppingCart />
        </Link>
      </div>
    </header>
  );
}
