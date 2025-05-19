import { Path } from '@/config/routesConfig';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.scss';
import { useEffect, useState } from 'react';
import logo from '@assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { shop } from '@config/localStorageConfig';

export function Header() {
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  const navigate = useNavigate();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  let logInOrLogOutLink = isAuthorized ? (
    <button onClick={handleLogout} className={styles['nav-btn']}>
      Logout
    </button>
  ) : (
    <Link to={Path.login} className={styles['nav-link']}>
      Login
    </Link>
  );

  function handleLogout() {
    localStorage.removeItem(shop.client_token);
    dispatch(logout());
    navigate(Path.empty);
  }

  useEffect(() => {
    const authToken = localStorage.getItem(shop.client_token);
    if (authToken) {
      dispatch(login(authToken));
    }
  }, []);

  function handleMenu() {
    setIsOpenMenu(state => !state);
  }

  useEffect(() => {
    function handleWindowResize() {
      if (window.innerWidth > 942) {
        setIsOpenMenu(false);
      }
    }

    window.addEventListener('resize', handleWindowResize);
  }, []);

  function handleLink(event: React.MouseEvent) {
    const target = event.target;

    if (target instanceof HTMLElement) {
      if (target.closest('a')) {
        setIsOpenMenu(false);
      }
    }
  }

  const productId = 1;

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <nav
            onClick={handleLink}
            className={`${styles.nav} ${isOpenMenu ? styles['nav-active'] : ''}`}
          >
            <ul className={styles['nav-list']}>
              <li className={styles['nav-item']}>
                <Link to={Path.empty} className={styles['nav-link']}>
                  <img className={styles['logo']} src={logo} alt="Logo" />
                </Link>
              </li>
              <li className={styles['nav-item']}>
                <Link to={Path.allProducts} className={styles['nav-link']}>
                  Catalog
                </Link>
              </li>
              <li className={styles['nav-item']}>
                {productId ? (
                  <Link to={`${Path.product}/${productId}`} className={styles['nav-link']}>
                    Product
                  </Link>
                ) : null}
              </li>
              <li className={styles['nav-item']}>
                <Link to={Path.user} className={styles['nav-link']}>
                  User
                </Link>
              </li>
              <li className={styles['nav-item']}>
                <Link to={Path.basket} className={styles['nav-link']}>
                  Basket
                </Link>
              </li>
              <li className={styles['nav-item']}>
                <Link to={Path.about} className={styles['nav-link']}>
                  About
                </Link>
              </li>
            </ul>
            <ul className={styles['nav-list']}>
              <li className={styles['nav-item']}>
                <Link
                  to={Path.registration}
                  className={isAuthorized ? 'display-none' : styles['nav-link']}
                >
                  Register
                </Link>
              </li>
              <li className={styles['nav-item']}>{logInOrLogOutLink}</li>
            </ul>
          </nav>
        </div>
        <button onClick={handleMenu} className={styles['nav-menu-btn']}>
          <span
            className={`${styles['nav-top-span']} ${isOpenMenu ? styles['nav-top-span-active'] : ''}`}
          />
          <span
            className={`${styles['nav-mid-span']} ${isOpenMenu ? styles['nav-mid-span-active'] : ''}`}
          />
          <span
            className={`${styles['nav-bottom-span']} ${isOpenMenu ? styles['nav-bottom-span-active'] : ''}`}
          />
        </button>
      </header>
    </>
  );
}
