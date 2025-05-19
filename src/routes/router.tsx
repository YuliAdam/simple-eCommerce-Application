import { Path } from '@/config/routesConfig';
import { Layout } from '@/layout/layout';
import { NotFound } from '@/pages/notFound/notFound';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from './redirect';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound error={'404'} />,
    children: [
      {
        path: Path.empty,
        Component: lazy(() => import('@pages/index/index')),
      },
      {
        path: Path.login,
        Component: lazy(() => import('@pages/login/login')),
      },
      {
        path: Path.about,
        Component: lazy(() => import('@pages/about/about')),
      },

      {
        path: Path.allProducts,
        Component: lazy(() => import('@pages/allProducts/allProducts')),
      },
      {
        path: Path.product,
        Component: lazy(() => import('@pages/product/product')),
      },
      {
        path: Path.basket,
        Component: lazy(() => import('@pages/basket/basket')),
      },

      {
        path: Path.registration,
        Component: lazy(() => import('@pages/registration/registration')),
      },
      {
        path: Path.user,
        Component: lazy(() => import('@pages/user/user')),
      },
    ],
  },
]);
