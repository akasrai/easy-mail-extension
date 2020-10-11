import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/app';
import * as serviceWorker from './serviceWorker';

import './assets/sass/style.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
