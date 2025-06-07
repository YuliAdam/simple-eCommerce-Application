import { SHOP } from '@/config/localStorageConfig';
import { Path } from '@/config/routesConfig';
import type { RootState } from '@/store/store';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
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

export function AuthRedirectIfAnonimUser({ children }: ProtectedRouteProps) {
  const isAuth = useSelector((state: RootState) => state.auth);

  if (!isAuth.isAuthorized) {
    return <Navigate to={Path.empty} replace />;
  }

  return children;
}
