import type { ReactElement } from 'react';

export function Header(): ReactElement {
  return (
    <header>
      <p>header</p>
      <code>
        Routes: empty = "/", login = "/login", index = "/index", registration = "/registration",
        allProducts = "/product", product = "/product/:id", user = "/user", basket = "/basket",
        about = "/about", notFound = "*",
      </code>
    </header>
  );
}
