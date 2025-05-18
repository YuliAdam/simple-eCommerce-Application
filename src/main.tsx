import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { App } from '@app/app';
import { store } from '@store/store';
import './styles.scss';

const rootElement = document.createElement('div');
document.body.prepend(rootElement);
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
