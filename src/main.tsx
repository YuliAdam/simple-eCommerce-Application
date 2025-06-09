import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { App } from '@app/app';
import { store } from '@store/store';
import './styles.scss';
import { createAnonymousBasket, getBasket } from './services/basketController';
import { SHOP } from './config/localStorageConfig';

const rootElement = document.createElement('div');
rootElement.classList.add('body_wrap');
document.body.prepend(rootElement);
const root = createRoot(rootElement);

document.addEventListener('DOMContentLoaded', () => {
  localStorage.getItem(SHOP.client_cart_id)
    ? getBasket(localStorage.getItem(SHOP.client_cart_id))
    : localStorage.getItem(SHOP.anonymous_cart_id)
      ? getBasket()
      : createAnonymousBasket({ currency: 'EUR', country: 'GB' });
});

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
