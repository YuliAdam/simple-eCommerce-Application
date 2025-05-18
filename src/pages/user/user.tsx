import { shop } from '@/config/localStorageConfig';
import type { JSX } from 'react';

export function User(): JSX.Element {
  //  impl getUser() >  from api
  const userClientId = localStorage.getItem(shop.client_id);
  return <section>user: {userClientId}</section>;
}
