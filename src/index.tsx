import React from 'react';
import ReactDOM from 'react-dom';
import './index.global.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './webcomponents-registration';

const root = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  root,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
