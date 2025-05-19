import { Path } from '@/config/routesConfig';
import { Layout } from '@/layout/layout';
import { NotFound } from '@/pages/notFound/notFound';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from './redirect';

const LoginForm = lazy(() => import('@pages/login/login'));
const RegisterForm = lazy(() => import('@pages/registration/registration'));
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
        element: (
          <AuthRedirect>
            <LoginForm />
          </AuthRedirect>
        ),
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
        element: (
          <AuthRedirect>
            <RegisterForm />
          </AuthRedirect>
        ),
      },
      {
        path: Path.user,
        Component: lazy(() => import('@pages/user/user')),
      },
    ],
  },
]);
