import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { About } from '@pages/about/about';
import { AllProducts } from '@pages/all-products/all-products';
import { Basket } from '@pages/basket/basket';
import { Index } from '@pages/index/index';
import { Login } from '@pages/login/login';
import { NotFound } from '@pages/not-found/not-found';
import { Product } from '@pages/product/product';
import { Registration } from '@pages/registration/registration';
import { User } from '@pages/user/user';

export enum Path {
  empty = '/',
  login = '/login',
  index = '/index',
  registration = '/registration',
  allProducts = '/product',
  product = '/product/:id',
  user = '/user',
  basket = '/basket',
  about = '/about',
  notFound = '*',
}

export function Main(): ReactElement {
  return (
    <main>
      <Routes>
        <Route path={Path.empty} element={true ? <Index /> : <Login />} />
        <Route path={Path.login} element={<Login />} />
        <Route path={Path.registration} element={<Registration />} />
        <Route path={Path.index} element={<Index />} />
        <Route path={Path.allProducts} element={<AllProducts />} />
        <Route path={Path.product} element={<Product />} />
        <Route path={Path.user} element={<User />} />
        <Route path={Path.basket} element={<Basket />} />
        <Route path={Path.about} element={<About />} />
        <Route path={Path.notFound} element={<NotFound />} />
      </Routes>
    </main>
  );
}
