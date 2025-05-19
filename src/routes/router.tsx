import { Path } from '@/config/routesConfig';
import { Layout } from '@/layout/layout';
import { NotFound } from '@/pages/notFound/notFound';
import { createBrowserRouter } from 'react-router-dom';
import { AuthRedirect } from './redirect';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound error={'404'} />,
    children: [
      {
        path: Path.empty,
        async lazy() {
          try {
            const { Index } = await import('@pages/index/index');
            return {
              element: <Index />,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
      {
        path: Path.login,
        async lazy() {
          try {
            const { LoginForm } = await import('@pages/login/login');
            return {
              element: (
                <AuthRedirect>
                  <LoginForm />
                </AuthRedirect>
              ),
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
      {
        path: Path.about,
        async lazy() {
          try {
            const { About } = await import('@pages/about/about');
            return {
              element: <About />,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
      {
        path: Path.allProducts,
        async lazy() {
          try {
            const { AllProducts } = await import('@pages/allProducts/allProducts');
            return {
              element: <AllProducts />,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
      {
        path: Path.product,
        async lazy() {
          try {
            const { Product } = await import('@pages/product/product');
            return { element: <Product /> };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
      {
        path: Path.basket,
        async lazy() {
          try {
            const { Basket } = await import('@pages/basket/basket');
            return {
              element: <Basket />,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },

      {
        path: Path.registration,
        async lazy() {
          try {
            const { Registration } = await import('@pages/registration/registration');
            return {
              element: <Registration />,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
      {
        path: Path.user,
        async lazy() {
          try {
            const { User } = await import('@pages/user/user');
            return {
              element: <User />,
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '404';
            return { element: <NotFound error={errorMessage} /> };
          }
        },
      },
    ],
  },
]);
