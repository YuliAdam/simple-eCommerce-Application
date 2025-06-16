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
import { toggleDialog } from '@/store/slices/dialogSlice';
import { setItemsId, setTotalItems } from '@/store/slices/basketSlice';
import { getBasket } from '@/services/basketController';
import type { ItemsIdObject } from '@/interfaces/types';

export function Header() {
  const basket = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state: RootState) => state.auth.isAuthorized);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  isMenuOpen
    ? document.documentElement.classList.add('noscroll')
    : document.documentElement.classList.remove('noscroll');
  const id =
    localStorage.getItem(SHOP.client_cart_id) || localStorage.getItem(SHOP.anonymous_cart_id);

  useEffect(() => {
    const authToken = localStorage.getItem(SHOP.client_token);
    if (authToken) {
      dispatch(login(authToken));
    }
    getBasket(id).then(res => {
      if (res) {
        dispatch(setTotalItems(res.body.totalLineItemQuantity || 0));
        const itemsIdObjectArr: ItemsIdObject[] = res.body.lineItems.map(item => {
          return { id: item.productId, variantId: item.variant.id };
        });
        dispatch(setItemsId(itemsIdObjectArr));
      }
    });
  }, ['']);

  function handleLogout() {
    localStorage.removeItem(SHOP.client_token);
    localStorage.removeItem(SHOP.client_id);
    localStorage.removeItem(SHOP.client_cart_id);
    dispatch(logout());
    dispatch(setTotalItems(0));
    navigate(Path.login);
    setIsMenuOpen(false);
  }

  return (
    <header className={styles.header} onClick={() => dispatch(toggleDialog(false))}>
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
          <ShoppingCart className={styles['icon-basket']} text={basket.totalItems} />
        </Link>
      </div>
    </header>
  );
}
