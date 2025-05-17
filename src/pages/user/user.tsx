import type { JSX } from 'react';

export function User(): JSX.Element {
  const userClientId = localStorage.getItem('[simple]client_id');
  return <section>user: {userClientId}</section>;
}
