import { Path } from '@/config/routesConfig';
import { Link } from 'react-router-dom';

export function Header() {
  const productId = 1;
  return (
    <>
      <p>header</p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to={Path.login}> login </Link>
        <Link to={Path.registration}> registration </Link>
        <Link to={Path.allProducts}> allProducts </Link>
        {productId ? <Link to={`${Path.product}/${productId}`}> product </Link> : null}
        <Link to={Path.user}> user </Link>
        <Link to={Path.basket}> basket </Link>
        <Link to={Path.about}> about </Link>
      </div>
      <code>
        Routes: empty = "/", login = "/login", registration = "/registration", allProducts =
        "/product", product = "/product/:id", user = "/user", basket = "/basket", about = "/about",
        notFound = "*",
      </code>
    </>
  );
}
