import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';
import { hot } from 'react-hot-loader';

import { Elements } from './Elements';

type AppState = { show: boolean };

export class App extends Component<unknown, AppState> {
  readonly state: AppState = { show: false };

  render() {
    const { show } = this.state;
    return (
      <div className={styles.app}>
        <header className={styles.appHeader}>
          <img src={logo} className={styles.appLogo} alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          {show && <Elements />}
          <a
            className={styles.appLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <label>
            <input
              type="checkbox"
              onClick={e => {
                this.setState({ show: e.currentTarget.checked });
              }}
            />
            {show ? 'show' : 'hide'}
          </label>
        </header>
      </div>
    );
  }
}

export default hot(module)(App);
