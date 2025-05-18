import { shop } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function AuthRedirect({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem(shop.client_token) && localStorage.getItem(shop.client_id); // TODO: how to check that token is valid?

  if (isAuth) {
    return <Navigate to={Path.user} replace />;
  }

  return children;
}
