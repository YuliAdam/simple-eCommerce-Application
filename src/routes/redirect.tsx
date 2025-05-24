import { SHOP } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function AuthRedirect({ children }: ProtectedRouteProps) {
  const isAuth = localStorage.getItem(SHOP.client_id) && localStorage.getItem(SHOP.client_token); // TODO: how to check that token is valid?

  if (isAuth) {
    return <Navigate to={Path.empty} replace />;
  }

  return children;
}
