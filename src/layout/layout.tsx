import { Header } from '@components/header/header';
import { Footer } from '@components/footer/footer';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

import styles from './preloader.module.scss';
import { Dialog } from '@/components/dialog/Dialog';

export const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Dialog />
        <Suspense
          fallback={
            <div className={styles.container}>
              <span className={styles.element}></span>
              <span className={styles.element}></span>
              <span className={styles.element}></span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};
