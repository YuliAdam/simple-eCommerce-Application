import type { ReactElement } from 'react';
import { Footer } from './view/footer/footer';
import { Header } from './view/header/header';
import { Main } from './view/main/main';

export function App(): ReactElement {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
