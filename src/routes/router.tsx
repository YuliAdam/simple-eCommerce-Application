import { Path } from '@/config/routesConfig';
import { Layout } from '@/layout/layout';
import { NotFound } from '@/pages/notFound/notFound';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect, AuthRedirectIfAnonimUser } from './redirect';
import User from '@pages/user/user';

const LoginForm = lazy(() => import('@pages/login/login'));
const RegisterForm = lazy(() => import('@pages/registration/registration'));
const PAGE_NOT_FOUND_ERROR = '404';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound error={PAGE_NOT_FOUND_ERROR} />,
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
        element: (
          <AuthRedirectIfAnonimUser>
            <User />
          </AuthRedirectIfAnonimUser>
        ),
      },
    ],
  },
]);
