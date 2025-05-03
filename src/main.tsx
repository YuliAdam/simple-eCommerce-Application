import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.createElement('div');
rootElement.id = 'root';

document.body.appendChild(rootElement);

if (rootElement instanceof HTMLElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div>
        <h1>Welcome to eCommerce Application!</h1>
      </div>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
