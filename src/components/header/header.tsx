import { Path } from '@/config/routesConfig';
import { Link, useNavigate } from 'react-router-dom';
import styles from './header.module.scss';
import { useEffect } from 'react';
import logo from '@assets/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/store/slices/authSlice';
import type { RootState } from '@/store/store';
import { shop } from '@config/localStorageConfig';

export function Header() {
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);

  const navigate = useNavigate();

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

  const productId = 1;

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.nav}>
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
      </header>
    </>
  );
}
