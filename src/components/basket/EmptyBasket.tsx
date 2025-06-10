import { ShoppingCart } from '@/assets/img/cart';
import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';
import styles from '@pages/basket/basket.module.scss';

export default function EmptyBasket() {
  return (
    <div className={styles.basket_empty}>
      <ShoppingCart />
      <p>Shopping cart is empty</p>
      <Link to={Path.allProducts}>Visit catalog</Link>
    </div>
  );
}
