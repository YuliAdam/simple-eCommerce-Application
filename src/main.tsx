import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from '@app/app';
import { store } from '@store/store';
import { getProject } from './services/client';

const rootElement = document.createElement('div');
document.body.prepend(rootElement);
const root = createRoot(rootElement);

getProject();

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
